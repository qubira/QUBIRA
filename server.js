'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const rateLimit  = require('express-rate-limit');
const { testConnection } = require('./src/db');

const authRouter     = require('./src/routes/auth');
const usuariosRouter = require('./src/routes/usuarios');

const app    = express();
const PORT   = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

/* ============================================================
   MIDDLEWARES GLOBALES
   ============================================================ */
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tudominio.com']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* Rate limit: login — máx 10 intentos / 15 min por IP */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* Rate limit general API */
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

/* ============================================================
   HEALTH CHECK
   ============================================================ */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'running', env: process.env.NODE_ENV });
});

/* ============================================================
   RUTAS HTML — antes del estático para tener prioridad
   ============================================================ */
app.get('/',         (_, res) => res.sendFile(path.join(PUBLIC, 'Index.html')));
app.get('/login',    (_, res) => res.sendFile(path.join(PUBLIC, 'qubiralogin.html')));
app.get('/control',  (_, res) => res.sendFile(path.join(PUBLIC, 'control.html')));

/* ============================================================
   ARCHIVOS ESTÁTICOS — sirve todo public/
   ============================================================ */
app.use(express.static(PUBLIC, { index: false }));

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
   ============================================================ */
(async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`[SERVER] QUBIRA corriendo en http://localhost:${PORT}`);
    console.log(`[SERVER] Frontend: ${PUBLIC}`);
    console.log(`[SERVER] Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
})();
