import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockModelo = {
    obtenerProductos: vi.fn(),
    obtenerProducto: vi.fn(),
    altaProducto: vi.fn(),
    modificarProducto: vi.fn(),
    eliminarProducto: vi.fn(),
};

vi.mock('../../api-crud/modulos/productos/modelo.productos.mjs', () => ({
    default: mockModelo,
}));

// Mock multer so file uploads work without real disk
vi.mock('../../api-crud/utilidades/util.multer.mjs', () => ({
    default: (req, res, next) => {
        req.file = req.headers['x-test-file']
            ? { filename: 'test-imagen.jpg' }
            : undefined;
        next();
    },
}));

const request = (await import('supertest')).default;
const app = (await import('../../app.mjs')).default;

const PRODUCTO_EJEMPLO = {
    producto_id: 1, nombre: 'Laptop Pro', descripcion: 'Buena laptop',
    precio: 1500, stock: 10, categoria: 'PC', imagen: 'img.jpg', estado: 'activo',
};

describe('GET /api/productos', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 200 con { data: [] } si no hay productos', async () => {
        mockModelo.obtenerProductos.mockResolvedValue([]);
        const res = await request(app).get('/api/productos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: [] });
    });

    it('devuelve 200 con { data: [...] } con productos', async () => {
        mockModelo.obtenerProductos.mockResolvedValue([PRODUCTO_EJEMPLO]);
        const res = await request(app).get('/api/productos');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].nombre).toBe('Laptop Pro');
    });
});

describe('GET /api/productos/:id', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 200 con { data: producto } si existe', async () => {
        mockModelo.obtenerProducto.mockResolvedValue([PRODUCTO_EJEMPLO]);
        const res = await request(app).get('/api/productos/1');
        expect(res.status).toBe(200);
        expect(res.body.data.nombre).toBe('Laptop Pro');
    });

    it('devuelve 404 si el producto no existe', async () => {
        mockModelo.obtenerProducto.mockResolvedValue([]);
        const res = await request(app).get('/api/productos/99');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensaje');
    });
});

describe('POST /api/productos', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 400 si faltan campos obligatorios', async () => {
        // Enviamos JSON — express.json() lo parsea; el mock de multer setea req.file
        const res = await request(app)
            .post('/api/productos')
            .set('x-test-file', 'true')
            .send({ precio: '999', stock: '5', estado: 'activo' }); // sin nombre
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensaje');
    });

    it('devuelve 400 si estado es inválido', async () => {
        const res = await request(app)
            .post('/api/productos')
            .set('x-test-file', 'true')
            .send({ nombre: 'Laptop', precio: '999', stock: '5', estado: 'invalido' });
        expect(res.status).toBe(400);
    });

    it('devuelve 201 con mensaje en alta exitosa', async () => {
        mockModelo.altaProducto.mockResolvedValue({ rowCount: 1 });
        const res = await request(app)
            .post('/api/productos')
            .set('x-test-file', 'true')
            .send({ nombre: 'Laptop', precio: '999', stock: '5', estado: 'activo', descripcion: 'Buena', categoria: 'PC' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('mensaje');
    });
});

describe('DELETE /api/productos/:id', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 200 con mensaje en eliminación exitosa', async () => {
        mockModelo.eliminarProducto.mockResolvedValue({ rowCount: 1 });
        const res = await request(app).delete('/api/productos/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('mensaje');
    });
});
