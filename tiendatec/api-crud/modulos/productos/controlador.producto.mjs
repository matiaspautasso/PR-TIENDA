import modelo from '../productos/modelo.productos.mjs';

const ESTADOS_VALIDOS = ['activo', 'inactivo'];

async function obtenerProductos(peticion, respuesta) {
    try {
        const productos = await modelo.obtenerProductos();
        return respuesta.status(200).json({ data: productos });
    } catch (error) {
        console.error(error);
        return respuesta.status(500).json({ mensaje: 'No se pueden obtener los productos' });
    }
}

async function obtenerProducto(peticion, respuesta) {
    const { producto_id } = peticion.params;
    if (!producto_id) {
        return respuesta.status(400).json({ mensaje: 'Datos incompletos' });
    }
    try {
        const rows = await modelo.obtenerProducto({ producto_id });
        if (rows.length === 0) {
            return respuesta.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        return respuesta.status(200).json({ data: rows[0] });
    } catch (error) {
        console.error(error);
        return respuesta.status(500).json({ mensaje: 'No se puede obtener el producto' });
    }
}

async function altaProducto(peticion, respuesta) {
    if (!peticion.file) {
        return respuesta.status(400).json({ mensaje: 'Falta la imagen del producto' });
    }
    const { nombre, descripcion, precio, stock, categoria, estado } = peticion.body;
    if (!nombre || !precio || stock === undefined || stock === '' || !estado) {
        return respuesta.status(400).json({ mensaje: 'Datos incompletos' });
    }
    if (!ESTADOS_VALIDOS.includes(estado)) {
        return respuesta.status(400).json({ mensaje: 'Estado inválido. Debe ser activo o inactivo' });
    }
    const rutaImagen = peticion.file.filename;
    try {
        const resultado = await modelo.altaProducto({ nombre, descripcion, precio, stock, categoria, rutaImagen, estado });
        if (resultado.rowCount > 0) {
            return respuesta.status(201).json({ mensaje: 'Producto dado de alta' });
        }
        return respuesta.status(500).json({ mensaje: 'No se pudo dar de alta el producto' });
    } catch (error) {
        console.error(error);
        return respuesta.status(500).json({ mensaje: 'No se pudo dar de alta el producto' });
    }
}

async function modificarProducto(peticion, respuesta) {
    const { producto_id } = peticion.params;
    const { nombre, descripcion, precio, stock, categoria, estado } = peticion.body;
    const rutaImagen = peticion.file ? peticion.file.filename : '';

    if (!producto_id || !nombre || !precio || stock === undefined || stock === '' || !estado) {
        return respuesta.status(400).json({ mensaje: 'Datos incompletos' });
    }
    if (!ESTADOS_VALIDOS.includes(estado)) {
        return respuesta.status(400).json({ mensaje: 'Estado inválido. Debe ser activo o inactivo' });
    }
    try {
        const resultado = await modelo.modificarProducto({ nombre, descripcion, precio, stock, categoria, producto_id, rutaImagen, estado });
        if (resultado.rowCount > 0) {
            return respuesta.status(200).json({ mensaje: 'Producto modificado', data: resultado.rows[0] });
        }
        return respuesta.status(500).json({ mensaje: 'No se pudo modificar el producto' });
    } catch (error) {
        console.error(error);
        return respuesta.status(500).json({ mensaje: 'No se pudo modificar el producto' });
    }
}

async function eliminarProducto(peticion, respuesta) {
    const { producto_id } = peticion.params;
    if (!producto_id) {
        return respuesta.status(400).json({ mensaje: 'Datos incompletos' });
    }
    try {
        const resultado = await modelo.eliminarProducto({ producto_id });
        if (resultado.rowCount > 0) {
            return respuesta.status(200).json({ mensaje: 'Producto eliminado' });
        }
        return respuesta.status(500).json({ mensaje: 'No se pudo eliminar el producto' });
    } catch (error) {
        console.error(error);
        return respuesta.status(500).json({ mensaje: 'No se pudo eliminar el producto' });
    }
}

export default {
    obtenerProductos,
    obtenerProducto,
    altaProducto,
    modificarProducto,
    eliminarProducto,
};
