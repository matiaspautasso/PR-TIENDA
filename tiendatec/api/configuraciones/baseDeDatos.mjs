import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
host: 'localhost',
port: 5433,
user: 'postgres',
password: 'admin',
database: 'tienda',
});
export default pool;