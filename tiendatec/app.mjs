import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import rutasAdmin from './api-crud/rutas/rutasAdmin.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(compression());
app.use('/api/imagenes', express.static(join(__dirname, 'api/imagenes')));
app.use('/api', rutasAdmin);
app.use(express.static(join(__dirname, 'vistas/portfolio')));
app.use((peticion, respuesta) => respuesta.sendStatus(404));

export default app;
