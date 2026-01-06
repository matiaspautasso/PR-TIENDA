import express from 'express';
import cors from 'cors';
import controlador from './api.controlador.mjs';
// Router
const rutasAPI_v1 = express.Router();
// Rutas V1 GET
rutasAPI_v1.route('/productos').get(cors(),
controlador.obtenerProductos);
rutasAPI_v1
.route('/productos/:producto_id')
.get(cors(), controlador.obtenerProducto);
export default rutasAPI_v1;