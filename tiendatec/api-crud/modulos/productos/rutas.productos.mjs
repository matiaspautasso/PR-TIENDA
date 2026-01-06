import express from 'express';
import gestionarSubidaArchivos from '../../utilidades/util.multer.mjs'; 
import controlador from '../productos/controlador.producto.mjs';

//creamos el enrutador
const rutasProductos=express.Router();
rutasProductos.use(express.json());
rutasProductos.use(express.urlencoded({extended:true}));

rutasProductos
.route('/productos')
.get(controlador.obtenerProductos)
// Uso del middleware con multer en POST
.post(gestionarSubidaArchivos, controlador.altaProducto);
rutasProductos
.route('/productos/:producto_id')
.get(controlador.obtenerProducto)
// Uso del middleware con multer en PUT
.put(gestionarSubidaArchivos, controlador.modificarProducto)
.delete(controlador.eliminarProducto);
export default rutasProductos;