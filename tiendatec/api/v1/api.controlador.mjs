import modelo from './api.modelo.mjs';
async function obtenerProductos(peticion, respuesta) {
try {
const productos = await modelo.obtenerProductos();
if (productos.length > 0) {
return respuesta.status(200).json(productos);
} else {
return respuesta.status(200).json([]);
}
} catch (error) {
console.error(error);
return respuesta.status(404).json({ mensaje: 'No encontrado' });
}
}
async function obtenerProducto(peticion, respuesta) {
const { producto_id } = peticion.params;
try {
if (producto_id === '') {
return respuesta.status(404).json(
{ mensaje: 'No encontrado' }
);
} else {
const producto = await modelo.obtenerProducto(producto_id);
if (producto.length > 0) {
return respuesta.status(200).json(producto);
} else {
return respuesta.status(404).json(
{ mensaje: 'No encontrado' }
);
}
}
} catch (error) {
console.error(error);
return respuesta.status(404).json({ mensaje: 'No encontrado' });
}
}
export default {
obtenerProductos,
obtenerProducto,
};
