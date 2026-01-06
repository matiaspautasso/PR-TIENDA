import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import express from 'express';
import rutasProducto from '../modulos/productos/rutas.productos.mjs';
// Rutas específicas para el administrador
const rutasAdmin = express.Router();
// Uso "rutasProductos"
rutasAdmin.use('/', rutasProducto);
// Front Administración
rutasAdmin.use(
	'/admin',
	express.static(join(__dirname, '../../vistas/crud')),
);
export default rutasAdmin;


