import express from 'express';
// Api V1
import rutasAPI_v1 from '../../api/v1/api.rutas.mjs';
// Futura Api V2
// . . .
const rutasAPI = express.Router();
rutasAPI.use('/v1',rutasAPI_v1);
export default rutasAPI;