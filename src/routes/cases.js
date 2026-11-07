'use strict';

/* ============================================================
   Casos de Éxito Públicos — QUBIRA Web
   Consulta los proyectos marcados como show_on_web = true
   en la base compartida de Neon (ti.projects).
   ============================================================ */

const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, code, name, client, description, company_name, company_logo,
             CASE WHEN web_link_locked THEN NULL ELSE website_url END AS website_url,
             COALESCE(web_link_locked, false) AS link_bloqueado,
             project_type, family, web_metric, web_tagline, web_description, web_order
      FROM ti.projects
      WHERE show_on_web = true
      ORDER BY COALESCE(web_order, 0) ASC, created_at DESC
    `);
    res.json({ ok: true, cases: rows });
  } catch (e) {
    console.error('[CASES] Error consultando casos de éxito:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;

