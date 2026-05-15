import express from 'express';
import rutasProducto from '../modulos/productos/rutas.productos.mjs';

const rutasAdmin = express.Router();
rutasAdmin.use('/', rutasProducto);

export default rutasAdmin;
