'use strict';

const express    = require('express');
const multer     = require('multer');
const { pool }   = require('../db');
const cloudinary = require('../config/cloudinary');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* ============================================================
   Redes sociales soportadas
   ============================================================ */
const REDES_VALIDAS = ['instagram', 'tiktok', 'facebook', 'youtube', 'otro'];

/* ============================================================
   Tabla de videos — se crea sola si no existe (sin migraciones aparte)
   ============================================================ */
let tableReady = null;
function ensureTable() {
  if (!tableReady) {
    tableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS videos_redes (
        id                    SERIAL PRIMARY KEY,
        titulo                VARCHAR(150) NOT NULL,
        red                   VARCHAR(20)  NOT NULL DEFAULT 'otro',
        enlace_red            TEXT         NOT NULL,
        cloudinary_public_id  TEXT         NOT NULL,
        video_url             TEXT         NOT NULL,
        thumbnail_url         TEXT,
        publicado             BOOLEAN      NOT NULL DEFAULT TRUE,
        orden                 INTEGER      NOT NULL DEFAULT 0,
        subido_por            INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `).catch(err => {
      tableReady = null;
      throw err;
    });
  }
  return tableReady;
}
router.use((req, res, next) => {
  ensureTable()
    .then(() => next())
    .catch(err => {
      console.error('[VIDEOS] Error creando tabla:', err.message);
      res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    });
});

/* ============================================================
   Multer — recibe el archivo de video en memoria (máx. 150MB)
   ============================================================ */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('El archivo debe ser un video'));
    }
    cb(null, true);
  },
});

function subirACloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'qubira/redes' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

function generarThumbnail(publicId) {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [{ width: 500, crop: 'scale' }, { start_offset: '0' }],
  });
}

/* ============================================================
   GET /api/videos
   Público — solo videos publicados, para Index.html
   ============================================================ */
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, red, enlace_red, video_url, thumbnail_url, created_at
       FROM videos_redes
       WHERE publicado = TRUE
       ORDER BY orden ASC, created_at DESC`
    );
    return res.json({ ok: true, videos: rows });
  } catch (err) {
    console.error('[VIDEOS] GET / error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al obtener videos' });
  }
});

/* ============================================================
   GET /api/videos/admin
   Protegido — todos los videos (publicados y ocultos), para control.html
   ============================================================ */
router.get('/admin', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT v.id, v.titulo, v.red, v.enlace_red, v.video_url, v.thumbnail_url,
              v.publicado, v.orden, v.created_at, u.nombre AS subido_por_nombre
       FROM videos_redes v
       LEFT JOIN usuarios u ON u.id = v.subido_por
       ORDER BY v.orden ASC, v.created_at DESC`
    );
    return res.json({ ok: true, videos: rows });
  } catch (err) {
    console.error('[VIDEOS] GET /admin error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al obtener videos' });
  }
});

/* ============================================================
   POST /api/videos
   Protegido — sube el archivo a Cloudinary y guarda el registro
   ============================================================ */
router.post('/', requireAuth, (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err.message || 'Error al procesar el video' });
    }

    try {
      const { titulo, red, enlace_red } = req.body;

      if (!req.file) {
        return res.status(400).json({ ok: false, error: 'Debes adjuntar un archivo de video' });
      }
      if (!enlace_red || !enlace_red.trim()) {
        return res.status(400).json({ ok: false, error: 'El link de la red social es obligatorio' });
      }
      const redFinal = REDES_VALIDAS.includes(red) ? red : 'otro';

      let subido;
      try {
        subido = await subirACloudinary(req.file.buffer);
      } catch (cloudErr) {
        console.error('[VIDEOS] Error subiendo a Cloudinary:', cloudErr.message);
        return res.status(502).json({ ok: false, error: 'No se pudo subir el video a Cloudinary' });
      }

      const thumbnail = generarThumbnail(subido.public_id);

      const { rows } = await pool.query(
        `INSERT INTO videos_redes
           (titulo, red, enlace_red, cloudinary_public_id, video_url, thumbnail_url, subido_por)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id, titulo, red, enlace_red, video_url, thumbnail_url, publicado, orden, created_at`,
        [
          (titulo || '').trim() || 'Video sin título',
          redFinal,
          enlace_red.trim(),
          subido.public_id,
          subido.secure_url,
          thumbnail,
          req.user.id,
        ]
      );

      return res.status(201).json({ ok: true, video: rows[0] });
    } catch (dbErr) {
      console.error('[VIDEOS] POST / error:', dbErr.message);
      return res.status(500).json({ ok: false, error: 'Error al guardar el video' });
    }
  });
});

/* ============================================================
   PATCH /api/videos/:id/estado
   Protegido — alterna publicado / oculto
   ============================================================ */
router.patch('/:id/estado', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });

    const { rows } = await pool.query(
      `UPDATE videos_redes SET publicado = NOT publicado WHERE id = $1
       RETURNING id, publicado`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Video no encontrado' });

    return res.json({ ok: true, id: rows[0].id, publicado: rows[0].publicado });
  } catch (err) {
    console.error('[VIDEOS] PATCH estado error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al cambiar el estado' });
  }
});

/* ============================================================
   DELETE /api/videos/:id
   Protegido — elimina de Cloudinary y de la base de datos
   ============================================================ */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });

    const { rows } = await pool.query(
      'SELECT cloudinary_public_id FROM videos_redes WHERE id = $1', [id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Video no encontrado' });

    try {
      await cloudinary.uploader.destroy(rows[0].cloudinary_public_id, { resource_type: 'video' });
    } catch (cloudErr) {
      console.error('[VIDEOS] Aviso: no se pudo borrar de Cloudinary:', cloudErr.message);
    }

    await pool.query('DELETE FROM videos_redes WHERE id = $1', [id]);

    return res.json({ ok: true, message: 'Video eliminado' });
  } catch (err) {
    console.error('[VIDEOS] DELETE error:', err.message);
    return res.status(500).json({ ok: false, error: 'Error al eliminar el video' });
  }
});

module.exports = router;
