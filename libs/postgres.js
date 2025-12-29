const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('📊 PostgreSQL: Nueva conexión establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

async function getConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Cliente obtenido del pool');
    return client;
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
    throw error;
  }
}

async function closePool() {
  await pool.end();
  console.log('🔒 Pool de PostgreSQL cerrado');
}

module.exports = { getConnection, pool, closePool };
