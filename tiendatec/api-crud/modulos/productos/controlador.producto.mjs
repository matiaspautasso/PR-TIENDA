import modelo from "../productos/modelo.productos.mjs";

async function obtenerProductos(peticion, respuesta) {
  try {
    const productos = await modelo.obtenerProductos();
    return respuesta.status(200).json(productos);
  } catch (error) {
    console.error(error);
    return respuesta.status(500).json({ mensaje: 'No se pueden obtener los productos' });
  }
}

async function obtenerProducto(peticion, respuesta) {
// Obtenemos "producto_id"
const { producto_id } = peticion.params;
// Verificamos si existe
if (!producto_id || producto_id === '') {
return respuesta.status(400).json(
{ mensaje: 'Datos incompletos' }
);
}
try {
/*
Solicitamos al modelo
el producto indicado por "producto_id"
*/
const producto = await modelo.obtenerProducto(
{ producto_id }
);
// Devolvemos en formato JSON al cliente
return respuesta.status(200).json(producto);
} catch (error) {
console.error(error);
// Gestionamos el error
return respuesta
.status(500)
.json(
{ mensaje: 'No se puede obtener el producto' }
);
}
}

async function altaProducto(peticion, respuesta) {
console.log('📦 Datos recibidos:', {
body: peticion.body,
file: peticion.file ? peticion.file.filename : 'NO RECIBIDO'
});

/*
Obtenemos los datos enviados
para dar el alta a un producto
*/
const { nombre, precio, stock } = peticion.body;

/*
Validamos que la imagen haya sido procesada por Multer
*/
if (!peticion.file) {
console.error('❌ Error: No se recibió la imagen');
return respuesta.status(400).json(
{ mensaje: 'Falta la imagen del producto' }
);
}

/*
"rutaImagen" almacena la ruta de la imagen
subida por el cliente.
La propiedad ".file" es creada por el middleware
"multer"
*/
const rutaImagen = peticion.file.filename;

if (
nombre === '' ||
precio === '' ||
stock === '' ||
rutaImagen === ''
) {
return respuesta.status(400).json(
{ mensaje: 'Datos incompletos' }
);
}
try {
// Nos conectamos al modelo para el alta
const resultado = await modelo.altaProducto({
nombre,
precio,
stock,
rutaImagen,
});
// Dependiendo si hay datos o no
if (resultado.rowCount > 0) {
return respuesta
.status(201)
.json(
{ mensaje: 'Producto dado de alta' }
);
} else {
return respuesta
.status(500)
.json(
{ mensaje: 'No se pudo dar de alta el producto' }
);
}
} catch (error) {
console.error(error);
return respuesta
.status(500)
.json(
{ mensaje: 'No se pudo dar de alta el producto' }
);
}
}

async function modificarProducto(peticion, respuesta) {
// Parámetros entrantes
const { producto_id } = peticion.params;
const {
nombre,
precio,
stock,
} = peticion.body;
/*
Asigna '' solo si el usuario NO envía una imagen
Recordemos que ".file" lo gestiona el paquete "multer"
*/
const rutaImagen = peticion.file ? peticion.file.filename:'' ;
// Se verifica ID
if (!producto_id || producto_id === '') {
return respuesta.status(400).json(
{ mensaje: 'Datos incompletos' }
);
}
// Verificamos los datos
if (
!producto_id ||
producto_id === '' ||
nombre === '' ||
precio === '' ||
stock === ''
) {
return respuesta.status(400).json(
{
mensaje: 'Datos incompletos'
}
);
}
try {
// Nos conectamos al modelo
const resultado = await modelo.modificarProducto({
nombre,
precio,
stock,
producto_id,
rutaImagen,
});
if (resultado.rowCount > 0) {
const nuevaRuta = resultado.rows[0].imagen;
return respuesta
.status(200)
/*
Enviamos la propiedad con la ruta modificada
al Front por si necesita actualizar la vista.
*/
.json(
{
mensaje: 'Producto modificado',
imagen: nuevaRuta
}
);
} else {
return respuesta
.status(500)
.json(
{
mensaje: 'No se pudo modificar el producto'
}
);
}
} catch (error) {
console.error(error);return respuesta
.status(500)
.json(
{
mensaje: 'No se pudo modificar el producto'
}
);
}
}

async function eliminarProducto(peticion, respuesta) {
const { producto_id } = peticion.params;
// Verificamos que no esté vacío
if (!producto_id || producto_id === '') {
return respuesta.status(400).json(
{
mensaje: 'Datos incompletos'
}
);
}
try {
// Invocamos al modelo
const resultado = await modelo.eliminarProducto(
{ producto_id }
);
// Verificamos si hubo cambios
if (resultado.rowCount > 0) {
return respuesta
.status(200)
.json(
{
mensaje: 'Producto eliminado'
}
);
} else {
return respuesta
.status(500)
.json(
{
    mensaje: 'No se pudo eliminar el producto'
}
);
}
} catch (error) {
console.error(error);
return respuesta
.status(500)
.json(
{
mensaje: 'No se pudo eliminar el producto'
}
);
}
}
export default {
obtenerProductos,
obtenerProducto,
altaProducto,
modificarProducto,
eliminarProducto,
};