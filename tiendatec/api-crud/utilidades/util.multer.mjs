import multer from 'multer';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtenemos el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construimos ruta absoluta hacia api/imagenes
// Desde api-crud/utilidades/ subimos 2 niveles y entramos a api/imagenes
const rutaImagenes = join(__dirname, '../../api/imagenes');

console.log('📁 Ruta de imágenes configurada:', rutaImagenes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rutaImagenes);
  },
  filename: (req, file, cb) => {
    const nombreImagen = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = extname(file.originalname);
    cb(null, file.fieldname + '-' + nombreImagen + extension);
  }
});

const subidaArchivos = multer({ storage });

function gestionarSubidaArchivos(req, res, next) {
  const subir = subidaArchivos.single('imagen');
  subir(req, res, (error) => {
    if (error) {
      console.error('❌ Error en Multer:', error);
      return res.status(500).json({ error: 'Error al subir la imagen.' });
    }
    console.log('✅ Multer procesó:', req.file ? req.file.filename : 'Sin archivo');
    next();
  });
}

export default gestionarSubidaArchivos;