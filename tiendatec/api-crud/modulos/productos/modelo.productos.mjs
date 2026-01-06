import pool from '../../configuraciones/baseDeDatos.mjs';
import {rm} from 'fs/promises';
import {join} from 'path';  


async function obtenerProductos() {
try {
// Consulta
const resultado = await pool.query(
'SELECT * FROM productos'
);
return resultado.rows;
} catch (error) {
// Gestionamos el error
console.error(error);
throw error;
}
}

async function obtenerProducto(producto) {
  try {
    const { producto_id } = producto;
    const resultado = await pool.query(
      'SELECT * FROM productos WHERE producto_id=$1',
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
/*
Obtenemos las propiedades
pasadas como objeto y desestructuramos
*/
const {
nombre,
precio,
stock,
rutaImagen
} = producto;
// Consulta
const resultado = await pool.query(
`
INSERT INTO productos
(nombre, precio,stock, imagen)
VALUES($1,$2,$3,$4)
RETURNING producto_id
`,
[nombre, precio, stock, rutaImagen],
);
return resultado;
} catch (error) {
// Gestionamos el error
console.error(error);
throw error;
}
}


async function modificarProducto(producto) {
try {
/*
Obtenemos las propiedades
pasadas como objeto y desestructuramos
*/
const {
nombre,
precio,
stock,
producto_id,
rutaImagen,
} = producto;
/*
Vamos a utilizar una transacción
a fin de mantener la integridad
entre el registro de la base de datos
y la imagen guardada.
*/
const cliente = await pool.connect();
try {
// Inicio transacción
await cliente.query('BEGIN');
// Se obtiene el nombre imagen actual
const nombreImagen = await cliente.query(
`
SELECT imagen FROM productos
WHERE producto_id=$1
`,
[producto_id],
);
const imagenActual = nombreImagen.rows[0].imagen;
// Actualiza
const resultado = await cliente.query(
`
UPDATE productos SET
nombre=$1,
precio=$2,
stock=$3,
imagen=
CASE
WHEN $4='' THEN imagen
ELSE $4
END
WHERE producto_id=$5
RETURNING imagen, producto_id`,
[nombre, precio, stock, rutaImagen, producto_id],
);
/*
Solo borramos si hay una nueva imagen subida
*/
if (rutaImagen !== '' && resultado.rowCount > 0) {
try {
await rm(join(`api/imagenes/${imagenActual}`));
} catch (error) {
throw error;
}
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
// Gestionamos el error
console.error(error);
throw error;
}
}

async function eliminarProducto(producto) {
try {
// obtenemos el ID
const { producto_id } = producto;
// Creamos una transacción
const cliente = await pool.connect();
try {
await cliente.query('BEGIN');
const resultado = await cliente.query(
`
DELETE FROM productos
WHERE producto_id=$1
RETURNING producto_id, imagen
`,
[producto_id],
);
/*
Se obtiene la ruta
de la imagen del registro eliminado
*/
const rutaImagenEliminar = resultado.rows[0].imagen;
// Eliminar imagen
await rm(join(`api/imagenes/${rutaImagenEliminar}`));
// Si todo fue correcto
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

export default{
    obtenerProductos,
    obtenerProducto,
    altaProducto,
    modificarProducto,
    eliminarProducto    
};