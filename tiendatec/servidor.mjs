import express from 'express';
import compression from 'compression';
// Rutas
import rutasAdmin from './api-crud/rutas/rutasAdmin.mjs';
import rutasAPI from './api-crud/rutas/rutasApi.mjs';
// Configuraciones
const PUERTO = 3000;
// Instanciamos express
const servidor = express();
// Usamos la compresión
servidor.use(compression());
// Rutas estáticas api "imágenes"
servidor.use('/api/imagenes', express.static('api/imagenes'));
// Rutas admin
servidor.use('/api-crud', rutasAdmin);
// Rutas API
servidor.use('/api', rutasAPI);
// 404
servidor.use((peticion, respuesta) => {
	respuesta.sendStatus(404);
});
servidor.listen(PUERTO, () => {
console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
