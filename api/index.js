'use strict';

/* Punto de entrada para Vercel — cada archivo en api/ se despliega como
   su propia función serverless. server.js ya exporta la app de Express
   (module.exports = app) sin llamar a app.listen() cuando se hace
   require() en vez de ejecutarlo directo, así que acá solo hace falta
   reexportarla; el catch-all de vercel.json manda todas las rutas
   (estáticas, /login, /control, /api/*) a esta misma función. */
module.exports = require('../server');
