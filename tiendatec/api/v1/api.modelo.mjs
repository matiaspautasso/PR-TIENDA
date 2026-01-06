import pool from '../configuraciones/baseDeDatos.mjs';
async function obtenerProductos() {
try {
const resultado = await pool.query('SELECT * FROM productos');
return resultado.rows;
} catch (error) {
console.error(error);
throw error;
}
}
async function obtenerProducto(producto_id) {
try {
const resultado = await pool.query(
'SELECT * FROM productos WHERE producto_id=$1',
[producto_id],
);
return resultado.rows;
} catch (error) {
console.error(error);
throw error;
}
}
export default {
obtenerProductos,
obtenerProducto,
}