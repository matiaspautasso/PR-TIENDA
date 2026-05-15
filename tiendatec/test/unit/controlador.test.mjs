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

const { default: controlador } = await import('../../api-crud/modulos/productos/controlador.producto.mjs');

function mockReq(overrides = {}) {
    return { params: {}, body: {}, file: null, ...overrides };
}

function mockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe('obtenerProductos', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 200 con { data } cuando hay productos', async () => {
        const lista = [{ producto_id: 1, nombre: 'Laptop', precio: 999, stock: 5, estado: 'activo' }];
        mockModelo.obtenerProductos.mockResolvedValue(lista);
        const res = mockRes();
        await controlador.obtenerProductos(mockReq(), res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: lista });
    });

    it('devuelve 500 si el modelo lanza error', async () => {
        mockModelo.obtenerProductos.mockRejectedValue(new Error('DB error'));
        const res = mockRes();
        await controlador.obtenerProductos(mockReq(), res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });
});

describe('obtenerProducto', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 200 con { data } si el producto existe', async () => {
        const prod = { producto_id: 1, nombre: 'Laptop', estado: 'activo' };
        mockModelo.obtenerProducto.mockResolvedValue([prod]);
        const res = mockRes();
        await controlador.obtenerProducto(mockReq({ params: { producto_id: '1' } }), res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: prod });
    });

    it('devuelve 404 si el producto no existe', async () => {
        mockModelo.obtenerProducto.mockResolvedValue([]);
        const res = mockRes();
        await controlador.obtenerProducto(mockReq({ params: { producto_id: '99' } }), res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    it('devuelve 400 si falta producto_id', async () => {
        const res = mockRes();
        await controlador.obtenerProducto(mockReq({ params: {} }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

describe('altaProducto', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 400 si no hay imagen', async () => {
        const res = mockRes();
        await controlador.altaProducto(
            mockReq({ body: { nombre: 'X', precio: '100', stock: '1', estado: 'activo' }, file: null }),
            res
        );
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('devuelve 400 si estado es inválido', async () => {
        const res = mockRes();
        await controlador.altaProducto(
            mockReq({ body: { nombre: 'X', precio: '100', stock: '1', estado: 'borrador' }, file: { filename: 'x.jpg' } }),
            res
        );
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ mensaje: expect.stringMatching(/Estado/) });
    });

    it('devuelve 400 si faltan campos obligatorios', async () => {
        const res = mockRes();
        await controlador.altaProducto(
            mockReq({ body: { precio: '100', stock: '1', estado: 'activo' }, file: { filename: 'x.jpg' } }),
            res
        );
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('devuelve 201 con mensaje en alta exitosa', async () => {
        mockModelo.altaProducto.mockResolvedValue({ rowCount: 1 });
        const res = mockRes();
        await controlador.altaProducto(
            mockReq({
                body: { nombre: 'Laptop', precio: '999', stock: '5', descripcion: 'Una laptop', categoria: 'PC', estado: 'activo' },
                file: { filename: 'laptop.jpg' },
            }),
            res
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });
});

describe('eliminarProducto', () => {
    beforeEach(() => vi.clearAllMocks());

    it('devuelve 400 si falta producto_id', async () => {
        const res = mockRes();
        await controlador.eliminarProducto(mockReq({ params: {} }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('devuelve 200 con mensaje en eliminación exitosa', async () => {
        mockModelo.eliminarProducto.mockResolvedValue({ rowCount: 1 });
        const res = mockRes();
        await controlador.eliminarProducto(mockReq({ params: { producto_id: '1' } }), res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });
});
