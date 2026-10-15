'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { decryptTotpSecret, verifyTOTP } = require('../lib/totp');

const router = express.Router();

/* ============================================================
   POST /api/auth/login
   Body: { username, password }
   ============================================================ */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Usuario y contraseña requeridos' });
    }

    /* Buscar usuario con su rol y estado de 2FA */
    const { rows } = await pool.query(
      `SELECT u.id, u.nombre, u.apellidos, u.correo, u.username,
              u.password_hash, u.estado, u.avatar_color,
              u.totp_enabled, u.totp_secret,
              r.nombre AS rol, r.nivel_acceso
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
       WHERE u.username = $1`,
      [username.trim().toLowerCase()]
    );

    if (!rows.length) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    if (user.estado !== 'activo') {
      return res.status(403).json({ ok: false, error: 'Cuenta desactivada. Contacta al administrador.' });
    }

    /* Verificar contraseña con bcrypt */
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
    }

    /* Si el usuario tiene 2FA (TOTP) activo, requerir segundo paso */
    if (user.totp_enabled) {
      const preToken = jwt.sign(
        { sub: user.id, stage: 'totp' },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      return res.json({ ok: true, totp_required: true, pre_token: preToken });
    }

    /* Generar JWT */
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { sub: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    /* Calcular fecha de expiración */
    const hours   = parseInt(expiresIn) || 24;
    const expires = new Date(Date.now() + hours * 3600 * 1000);

    /* Guardar sesión en la base de datos */
    await pool.query(
      `INSERT INTO sesiones (usuario_id, token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        token,
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent'] || null,
        expires,
      ]
    );

    /* Registrar en auditoría */
    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, realizado_por)
       VALUES ($1, 'LOGIN', $1)`,
      [user.id]
    );

    /* Cookie httpOnly para proteger rutas del servidor.
       JavaScript del cliente NO puede leerla ni modificarla. */
    res.cookie('qubira_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   hours * 3_600_000,
      path:     '/',
    });

    return res.json({
      ok: true,
      token,
      user: {
        id:           user.id,
        nombre:       user.nombre,
        apellidos:    user.apellidos,
        username:     user.username,
        correo:       user.correo,
        rol:          user.rol,
        nivel_acceso: user.nivel_acceso,
        avatar_color: user.avatar_color,
      },
    });

  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
});

/* ============================================================
   POST /api/auth/login/totp
   Body: { pre_token, code }
   Segundo paso de verificación 2FA (TOTP)
   ============================================================ */
router.post('/login/totp', async (req, res) => {
  try {
    const { pre_token, code } = req.body;

    if (!pre_token || !code) {
      return res.status(400).json({ ok: false, error: 'Falta el código de verificación o la sesión expiró' });
    }

    let payload;
    try {
      payload = jwt.verify(pre_token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ ok: false, error: 'La verificación expiró, vuelve a ingresar contraseña' });
    }

    if (payload.stage !== 'totp') {
      return res.status(401).json({ ok: false, error: 'Token de verificación inválido' });
    }

    const { rows } = await pool.query(
      `SELECT u.id, u.nombre, u.apellidos, u.correo, u.username,
              u.estado, u.avatar_color, u.totp_secret, u.totp_enabled,
              r.nombre AS rol, r.nivel_acceso
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
       WHERE u.id = $1`,
      [payload.sub]
    );

    if (!rows.length || rows[0].estado !== 'activo' || !rows[0].totp_enabled) {
      return res.status(403).json({ ok: false, error: 'Cuenta no disponible o 2FA no activo' });
    }

    const user = rows[0];
    const secret = decryptTotpSecret(user.totp_secret);
    const valid = verifyTOTP(code, secret);

    if (!valid) {
      return res.status(401).json({ ok: false, error: 'Código 2FA incorrecto o expirado' });
    }

    /* Generar JWT de sesión definitiva */
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { sub: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    const hours   = parseInt(expiresIn) || 24;
    const expires = new Date(Date.now() + hours * 3600 * 1000);

    /* Guardar sesión en la base de datos */
    await pool.query(
      `INSERT INTO sesiones (usuario_id, token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        token,
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent'] || null,
        expires,
      ]
    );

    /* Registrar en auditoría */
    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, realizado_por)
       VALUES ($1, 'LOGIN_2FA', $1)`,
      [user.id]
    );

    /* Cookie httpOnly para proteger rutas del servidor */
    res.cookie('qubira_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   hours * 3_600_000,
      path:     '/',
    });

    return res.json({
      ok: true,
      token,
      user: {
        id:           user.id,
        nombre:       user.nombre,
        apellidos:    user.apellidos,
        username:     user.username,
        correo:       user.correo,
        rol:          user.rol,
        nivel_acceso: user.nivel_acceso,
        avatar_color: user.avatar_color,
      },
    });

  } catch (err) {
    console.error('[AUTH] Login TOTP error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
});

/* ============================================================
   POST /api/auth/logout
   Header: Authorization: Bearer <token>
   ============================================================ */
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);

    await pool.query('DELETE FROM sesiones WHERE token = $1', [token]);

    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, realizado_por)
       VALUES ($1, 'LOGOUT', $1)`,
      [req.user.id]
    );

    /* Limpiar cookie de sesión del servidor */
    res.clearCookie('qubira_session', { path: '/' });

    return res.json({ ok: true, message: 'Sesión cerrada correctamente' });
  } catch (err) {
    console.error('[AUTH] Logout error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al cerrar sesión' });
  }
});

/* ============================================================
   GET /api/auth/me
   Devuelve info del usuario autenticado
   ============================================================ */
router.get('/me', requireAuth, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

module.exports = router;
