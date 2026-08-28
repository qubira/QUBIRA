'use strict';

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const rateLimit    = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { testConnection } = require('./src/db');
const { requireWebAuth } = require('./src/middleware/webAuth');

const authRouter     = require('./src/routes/auth');
const usuariosRouter = require('./src/routes/usuarios');
const videosRouter   = require('./src/routes/videos');

const app    = express();
const PORT   = process.env.PORT || 3000;
/* OJO: esta carpeta NO se llama "public" a propósito. En Vercel,
   cualquier carpeta llamada así en la raíz del proyecto se sirve como
   archivo estático directo desde su CDN, sin pasar por Express —
   eso saltearía requireWebAuth y expondría control.html/.js/.css sin
   login. Al llamarse "webapp" todo pasa sí o sí por este servidor. */
const PUBLIC = path.join(__dirname, 'webapp');

/* ============================================================
   MIDDLEWARES GLOBALES
   ============================================================ */
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim())
    : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ============================================================
   BLOQUEO ABSOLUTO — archivos que NUNCA deben exponerse
   (defensa en profundidad aunque no estén en webapp/)
   ============================================================ */
const BLOCKED_PATTERNS = [
  /\.env(\.|$)/i,
  /package(-lock)?\.json$/i,
  /^\/node_modules\//i,
  /^\/src\//i,
  /^\/server\.js$/i,
];

app.use((req, res, next) => {
  if (BLOCKED_PATTERNS.some(r => r.test(req.path))) {
    return res.status(403).json({ ok: false, error: 'Acceso denegado' });
  }
  next();
});

/* ============================================================
   RATE LIMITING
   ============================================================ */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: { ok: false, error: 'Demasiadas peticiones' },
});

/* ============================================================
   RUTAS API
   ============================================================ */
app.use('/api/auth/login', loginLimiter);
app.use('/api',            apiLimiter);
app.use('/api/auth',       authRouter);
app.use('/api/usuarios',   usuariosRouter);
app.use('/api/videos',     videosRouter);

/* Health check (sin exponer entorno) */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'running' });
});

/* ============================================================
   RUTAS HTML PÚBLICAS
   ============================================================ */
app.get('/', (_, res) => res.sendFile(path.join(PUBLIC, 'Index.html')));

/* /login → si ya tiene sesión válida redirige a /control */
app.get('/login', async (req, res) => {
  const token = req.cookies?.qubira_session;
  if (token) {
    try {
      const jwt    = require('jsonwebtoken');
      const { pool } = require('./src/db');
      jwt.verify(token, process.env.JWT_SECRET);
      const { rows } = await pool.query(
        'SELECT id FROM sesiones WHERE token=$1 AND expires_at>NOW()', [token]
      );
      if (rows.length) return res.redirect('/control');
    } catch { /* token inválido — sirve login normal */ }
  }
  res.sendFile(path.join(PUBLIC, 'qubiralogin.html'));
});

/* ============================================================
   RUTAS Y ASSETS PROTEGIDOS — solo usuarios autenticados
   ============================================================ */
app.get('/control',     requireWebAuth, (_, res) => res.sendFile(path.join(PUBLIC, 'control.html')));
app.get('/control.js',  requireWebAuth, (_, res) => res.sendFile(path.join(PUBLIC, 'control.js')));
app.get('/control.css', requireWebAuth, (_, res) => res.sendFile(path.join(PUBLIC, 'control.css')));

/* ============================================================
   ARCHIVOS ESTÁTICOS PÚBLICOS
   Solo sirve lo que queda en webapp/ (Index, login, styles, etc.)
   Los archivos protegidos ya fueron manejados arriba.
   ============================================================ */
app.use(express.static(PUBLIC, {
  index: false,
  setHeaders(res, filePath) {
    /* Nunca cachear archivos JS/CSS para que el auto-reload funcione */
    if (/\.(js|css)$/.test(filePath)) {
      res.set('Cache-Control', 'no-cache');
    }
  },
}));

/* ============================================================
   404 para rutas API no encontradas
   ============================================================ */
app.use('/api/*', (req, res) => {
  res.status(404).json({ ok: false, error: `Ruta ${req.path} no encontrada` });
});

/* ============================================================
   MANEJADOR GLOBAL DE ERRORES
   ============================================================ */
app.use((err, req, res, next) => {
  console.error('[SERVER] Error no manejado:', err.message);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

/* ============================================================
   INICIO DEL SERVIDOR
   Solo cuando este archivo se ejecuta directamente (node server.js,
   npm start/dev — desarrollo local o un host con proceso persistente
   como Render/Railway). En Vercel, api/index.js hace require() de este
   módulo para tomar `app` y lo sirve como función serverless por
   request — ahí NO se debe llamar app.listen(), Vercel maneja eso.
   ============================================================ */
if (require.main === module) {
  (async () => {
    try {
      await testConnection();
    } catch {
      process.exit(1); /* acá sí tiene sentido: es un proceso propio, no uno compartido */
    }
    app.listen(PORT, () => {
      console.log(`[SERVER] QUBIRA corriendo en http://localhost:${PORT}`);
      console.log(`[SERVER] Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  })();
}

module.exports = app;
