'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const { pool } = require('../db');
const { requireAuth, requireLevel } = require('../middleware/auth');

const router = express.Router();

/* Todos los endpoints requieren autenticación */
router.use(requireAuth);

/* ============================================================
   GET /api/usuarios
   Lista todos los usuarios (nivel >= 80 = ADMIN/CEO)
   ============================================================ */
router.get('/', requireLevel(80), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, apellidos, correo, username, celular,
              rol, nivel_acceso, estado, avatar_color, created_at, updated_at
       FROM v_usuarios_completo
       ORDER BY id ASC`
    );
    return res.json({ ok: true, usuarios: rows });
  } catch (err) {
    console.error('[USUARIOS] GET / error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al obtener usuarios' });
  }
});

/* ============================================================
   GET /api/usuarios/stats
   Estadísticas rápidas del módulo
   ============================================================ */
router.get('/stats', requireLevel(80), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*)                                        AS total,
         COUNT(*) FILTER (WHERE estado = 'activo')      AS activos,
         COUNT(*) FILTER (WHERE estado = 'inactivo')    AS inactivos,
         COUNT(*) FILTER (WHERE nivel_acceso >= 80)     AS admins
       FROM v_usuarios_completo`
    );
    return res.json({ ok: true, stats: rows[0] });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Error al obtener estadísticas' });
  }
});

/* ============================================================
   POST /api/usuarios
   Crear usuario (CEO/ADMIN)
   ============================================================ */
router.post('/', requireLevel(80), async (req, res) => {
  try {
    const { nombre, apellidos, dni, celular, correo, username, password, rol, estado, avatar_color } = req.body;

    /* Validaciones básicas */
    if (!nombre || !apellidos || !correo || !username || !password || !rol) {
      return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios' });
    }

    /* Obtener rol_id */
    const { rows: rolRows } = await pool.query(
      'SELECT id FROM roles WHERE nombre = $1', [rol.toUpperCase()]
    );
    if (!rolRows.length) {
      return res.status(400).json({ ok: false, error: 'Rol no válido' });
    }

    /* Verificar unicidad */
    const { rows: exists } = await pool.query(
      'SELECT id FROM usuarios WHERE username = $1 OR correo = $2',
      [username.trim().toLowerCase(), correo.trim().toLowerCase()]
    );
    if (exists.length) {
      return res.status(409).json({ ok: false, error: 'El usuario o correo ya existe' });
    }

    /* Hashear contraseña */
    const hash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO usuarios
         (nombre, apellidos, dni, celular, correo, username, password_hash, rol_id, estado, avatar_color)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, nombre, apellidos, correo, username, celular, estado, avatar_color, created_at`,
      [
        nombre.trim(),
        apellidos.trim(),
        dni?.trim() || null,
        celular?.trim() || null,
        correo.trim().toLowerCase(),
        username.trim().toLowerCase(),
        hash,
        rolRows[0].id,
        estado || 'activo',
        avatar_color ?? 0,
      ]
    );

    /* Auditoría */
    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, valor_nuevo, realizado_por)
       VALUES ($1, 'CREAR_USUARIO', $2, $3)`,
      [rows[0].id, username, req.user.id]
    );

    return res.status(201).json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error('[USUARIOS] POST / error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ ok: false, error: 'Usuario o correo duplicado' });
    }
    return res.status(500).json({ ok: false, error: 'Error al crear usuario' });
  }
});

/* ============================================================
   PUT /api/usuarios/:id
   Editar usuario (CEO/ADMIN)
   Solo CEO puede cambiar su propio nivel o editar a otro CEO
   ============================================================ */
router.put('/:id', requireLevel(80), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });

    /* Cargar usuario existente */
    const { rows: existing } = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre, r.nivel_acceso
       FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = $1`,
      [id]
    );
    if (!existing.length) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    const target = existing[0];

    /* Un ADMIN no puede editar un CEO */
    if (target.nivel_acceso >= 100 && req.user.nivel_acceso < 100) {
      return res.status(403).json({ ok: false, error: 'No puedes editar un usuario CEO' });
    }

    const { nombre, apellidos, dni, celular, correo, username, password, rol, estado, avatar_color } = req.body;

    /* Obtener rol_id si se cambia */
    let rolId = target.rol_id;
    if (rol && rol.toUpperCase() !== target.rol_nombre) {
      const { rows: rolRows } = await pool.query('SELECT id FROM roles WHERE nombre=$1', [rol.toUpperCase()]);
      if (!rolRows.length) return res.status(400).json({ ok: false, error: 'Rol no válido' });
      rolId = rolRows[0].id;
    }

    /* Hashear nueva contraseña solo si se proporciona */
    let hash = target.password_hash;
    if (password) {
      hash = await bcrypt.hash(password, 12);
    }

    const { rows } = await pool.query(
      `UPDATE usuarios SET
         nombre       = $1,
         apellidos    = $2,
         dni          = $3,
         celular      = $4,
         correo       = $5,
         username     = $6,
         password_hash= $7,
         rol_id       = $8,
         estado       = $9,
         avatar_color = $10
       WHERE id = $11
       RETURNING id, nombre, apellidos, correo, username, celular, estado, avatar_color, updated_at`,
      [
        nombre?.trim()             || target.nombre,
        apellidos?.trim()          || target.apellidos,
        dni?.trim()                || target.dni,
        celular?.trim()            || target.celular,
        correo?.trim().toLowerCase()|| target.correo,
        username?.trim().toLowerCase()|| target.username,
        hash,
        rolId,
        estado                     || target.estado,
        avatar_color ?? target.avatar_color,
        id,
      ]
    );

    /* Auditoría */
    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, valor_anterior, valor_nuevo, realizado_por)
       VALUES ($1, 'EDITAR_USUARIO', $2, $3, $4)`,
      [id, target.username, username || target.username, req.user.id]
    );

    return res.json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error('[USUARIOS] PUT error:', err.message);
    if (err.code === '23505') return res.status(409).json({ ok: false, error: 'Usuario o correo duplicado' });
    return res.status(500).json({ ok: false, error: 'Error al actualizar usuario' });
  }
});

/* ============================================================
   PATCH /api/usuarios/:id/estado
   Toggle activo/inactivo (ADMIN/CEO)
   ============================================================ */
router.patch('/:id/estado', requireLevel(80), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });

    /* No desactivarse a uno mismo */
    if (id === req.user.id) {
      return res.status(400).json({ ok: false, error: 'No puedes desactivar tu propia cuenta' });
    }

    const { rows } = await pool.query(
      `UPDATE usuarios
       SET estado = CASE WHEN estado = 'activo' THEN 'inactivo'::estado_usuario ELSE 'activo'::estado_usuario END
       WHERE id = $1
       RETURNING id, estado`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, valor_nuevo, realizado_por)
       VALUES ($1, 'CAMBIO_ESTADO', $2, $3)`,
      [id, rows[0].estado, req.user.id]
    );

    return res.json({ ok: true, id: rows[0].id, estado: rows[0].estado });
  } catch (err) {
    console.error('[USUARIOS] PATCH estado error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al cambiar estado' });
  }
});

/* ============================================================
   DELETE /api/usuarios/:id
   Solo CEO puede eliminar
   ============================================================ */
router.delete('/:id', requireLevel(100), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });

    if (id === req.user.id) {
      return res.status(400).json({ ok: false, error: 'No puedes eliminarte a ti mismo' });
    }

    /* Auditoría antes de eliminar */
    const { rows: target } = await pool.query('SELECT username FROM usuarios WHERE id=$1', [id]);
    if (!target.length) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, valor_anterior, realizado_por)
       VALUES ($1, 'ELIMINAR_USUARIO', $2, $3)`,
      [id, target[0].username, req.user.id]
    );

    await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);

    return res.json({ ok: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error('[USUARIOS] DELETE error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al eliminar usuario' });
  }
});

/* ============================================================
   POST /api/usuarios/:id/campo-protegido
   Ver dato protegido (dni, apellidos, password)
   Requiere master password
   ============================================================ */
router.post('/:id/campo-protegido', requireLevel(80), async (req, res) => {
  try {
    const id    = parseInt(req.params.id);
    const { campo, master_password } = req.body;

    if (!['apellidos', 'dni', 'password_hash'].includes(campo)) {
      return res.status(400).json({ ok: false, error: 'Campo no permitido' });
    }

    if (master_password !== process.env.MASTER_PASSWORD) {
      return res.status(403).json({ ok: false, error: 'Contraseña maestra incorrecta' });
    }

    const { rows } = await pool.query(
      `SELECT apellidos, dni, password_hash FROM usuarios WHERE id=$1`, [id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    /* Para password mostramos el hash (el valor legible se guardó en campo separado si se quiere)
       En una app real nunca expones el hash. Aquí lo mostramos en modo demo. */
    const valor = rows[0][campo];

    /* Auditoría */
    await pool.query(
      `INSERT INTO auditoria_usuarios (usuario_id, accion, campo_modificado, realizado_por)
       VALUES ($1, 'VER_CAMPO_PROTEGIDO', $2, $3)`,
      [id, campo, req.user.id]
    );

    return res.json({ ok: true, valor });
  } catch (err) {
    console.error('[USUARIOS] Campo protegido error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error interno' });
  }
});

module.exports = router;
