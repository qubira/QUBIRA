'use strict';

const { Pool } = require('pg');

/* Neon usa sslmode=require y a veces channel_binding=require.
   El parámetro channel_binding no es reconocido por pg < 8.12 y
   puede causar "server does not support SSL" si se deja en la URL.
   Lo eliminamos y forzamos SSL manualmente. */
function buildConnectionConfig() {
  const rawUrl = process.env.DATABASE_URL || '';

  if (!rawUrl) {
    /* process.exit() no se puede usar acá: en Vercel este archivo se
       carga dentro de una función serverless compartida, y matar el
       proceso ahí puede tirar abajo otras invocaciones en curso.
       Se lanza el error y que quien arranque el server decida qué
       hacer (en local, server.js lo deja morir igual si no conecta). */
    throw new Error('DATABASE_URL no está definida. Revisa tus variables de entorno.');
  }

  /* Eliminar parámetros que pg no entiende */
  const cleanUrl = rawUrl
    .replace(/[&?]channel_binding=[^&]*/g, '')
    .replace(/[&?]sslmode=[^&]*/g,         '');

  return {
    connectionString: cleanUrl,
    ssl: {
      rejectUnauthorized: false, /* Necesario para Neon/cloud PostgreSQL */
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(buildConnectionConfig());

pool.on('error', (err) => {
  console.error('[DB] Error inesperado en cliente idle:', err.message);
});

async function testConnection() {
  try {
    const { rows } = await pool.query('SELECT NOW() AS now');
    console.log('[DB] ✅ Conectado a Neon PostgreSQL —', rows[0].now);
  } catch (err) {
    console.error('[DB] ❌ Error de conexión:', err.message);
    throw err; /* quien llama decide si eso amerita salir del proceso (ver server.js) */
  }
}

module.exports = { pool, testConnection };
