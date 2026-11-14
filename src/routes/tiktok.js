'use strict';

/* ============================================================
   Videos de TikTok — QUBIRA Web
   Lee los videos de la cuenta de QUBIRA que sincroniza el módulo OCM
   (ocm.tiktok_videos, en la base compartida de Neon) para mostrarlos
   en la sección "Lo último que compartimos". Solo datos públicos.
   ============================================================ */

const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/videos', async (req, res) => {
  try {
    const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 12, 1), 30);
    const { rows } = await pool.query(`
      SELECT v.video_id, v.titulo, COALESCE(to_jsonb(v)->>'portada_cloud', v.portada) AS portada, v.enlace, v.duracion, v.publicado_en, v.vistas, v.likes,
             c.username
      FROM ocm.tiktok_videos v
      JOIN ocm.tiktok_cuentas c ON c.id = v.cuenta_id
      WHERE COALESCE((to_jsonb(v)->>'oculto')::boolean, false) = false AND to_jsonb(v)->>'eliminado_en' IS NULL -- sin ocultos ni eliminados
      ORDER BY v.publicado_en DESC NULLS LAST
      LIMIT $1`, [limite]);
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ ok: true, videos: rows });
  } catch (e) {
    // Si OCM aún no tiene datos (o la tabla no existe), la sección sigue con los videos manuales
    console.error('[TIKTOK] Error obteniendo videos:', e.message);
    res.json({ ok: true, videos: [] });
  }
});

module.exports = router;
