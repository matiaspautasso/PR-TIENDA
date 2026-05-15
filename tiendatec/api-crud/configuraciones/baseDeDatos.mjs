import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'tienda',
});

export default pool;
