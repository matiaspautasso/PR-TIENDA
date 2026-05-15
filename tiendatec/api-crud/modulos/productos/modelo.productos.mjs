import pool from '../../configuraciones/baseDeDatos.mjs';
import { rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUTA_IMAGENES = join(__dirname, '../../../api/imagenes');
const COLS = 'producto_id, nombre, descripcion, precio, stock, categoria, imagen, estado';

async function obtenerProductos() {
    try {
        const resultado = await pool.query(
            `SELECT ${COLS} FROM productos ORDER BY producto_id DESC`
        );
        return resultado.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function obtenerProducto(producto) {
    try {
        const { producto_id } = producto;
        const resultado = await pool.query(
            `SELECT ${COLS} FROM productos WHERE producto_id=$1`,
            [producto_id]
        );
        return resultado.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function altaProducto(producto) {
    try {
        const { nombre, descripcion, precio, stock, categoria, rutaImagen, estado } = producto;
        const resultado = await pool.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen, estado)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING producto_id`,
            [nombre, descripcion || '', precio, stock, categoria || '', rutaImagen, estado]
        );
        return resultado;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function modificarProducto(producto) {
    try {
        const { nombre, descripcion, precio, stock, categoria, producto_id, rutaImagen, estado } = producto;
        const cliente = await pool.connect();
        try {
            await cliente.query('BEGIN');
            const nombreImagen = await cliente.query(
                'SELECT imagen FROM productos WHERE producto_id=$1',
                [producto_id]
            );
            const imagenActual = nombreImagen.rows[0].imagen;
            const resultado = await cliente.query(
                `UPDATE productos SET
                    nombre=$1, descripcion=$2, precio=$3, stock=$4, categoria=$5,
                    imagen=CASE WHEN $6='' THEN imagen ELSE $6 END,
                    estado=$7
                 WHERE producto_id=$8
                 RETURNING ${COLS}`,
                [nombre, descripcion || '', precio, stock, categoria || '', rutaImagen, estado, producto_id]
            );
            if (rutaImagen !== '' && resultado.rowCount > 0 && imagenActual) {
                try {
                    await rm(join(RUTA_IMAGENES, imagenActual));
                } catch (_) { /* imagen puede no existir en disco */ }
            }
            await cliente.query('COMMIT');
            return resultado;
        } catch (error) {
            console.error(error);
            await cliente.query('ROLLBACK');
            throw error;
        } finally {
            cliente.release();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function eliminarProducto(producto) {
    try {
        const { producto_id } = producto;
        const cliente = await pool.connect();
        try {
            await cliente.query('BEGIN');
            const resultado = await cliente.query(
                'DELETE FROM productos WHERE producto_id=$1 RETURNING producto_id, imagen',
                [producto_id]
            );
            const rutaImagenEliminar = resultado.rows[0]?.imagen;
            if (rutaImagenEliminar) {
                try {
                    await rm(join(RUTA_IMAGENES, rutaImagenEliminar));
                } catch (_) { /* imagen puede no existir en disco */ }
            }
            await cliente.query('COMMIT');
            return resultado;
        } catch (error) {
            await cliente.query('ROLLBACK');
            throw error;
        } finally {
            cliente.release();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    obtenerProductos,
    obtenerProducto,
    altaProducto,
    modificarProducto,
    eliminarProducto,
};
