'use strict';

const jwt      = require('jsonwebtoken');
const { pool } = require('../db');

/**
 * Middleware para rutas HTML y assets protegidos.
 * Lee el cookie httpOnly `qubira_session` (no accesible desde JS).
 * Si no hay sesión válida → redirige a /login.
 */
async function requireWebAuth(req, res, next) {
  const token = req.cookies?.qubira_session;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await pool.query(
      `SELECT s.id FROM sesiones s
       JOIN usuarios u ON u.id = s.usuario_id
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.estado = 'activo'`,
      [token]
    );

    if (!rows.length) {
      res.clearCookie('qubira_session', { path: '/' });
      return res.redirect('/login');
    }

    next();
  } catch {
    res.clearCookie('qubira_session', { path: '/' });
    return res.redirect('/login');
  }
}

module.exports = { requireWebAuth };
