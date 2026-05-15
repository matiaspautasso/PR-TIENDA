import app from './app.mjs';

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
