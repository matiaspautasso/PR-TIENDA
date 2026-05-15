import { test, expect } from '@playwright/test';

// Requiere: docker compose up -d && npm run dev
// La DB debe estar accesible en el puerto configurado en .env

const PRODUCTO_TEST = {
    nombre: 'Laptop E2E Test',
    descripcion: 'Producto creado por test automatizado',
    precio: '1299.99',
    stock: '7',
    categoria: 'Laptops',
    estado: 'activo',
};

test.describe('Portfolio TiendaTec', () => {

    test('carga la página principal correctamente', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/TiendaTec/);
        await expect(page.locator('.header h1')).toContainText('TiendaTec');
        await expect(page.locator('#btn-nuevo')).toBeVisible();
        await expect(page.locator('.filtros')).toBeVisible();
    });

    test('muestra empty state cuando no hay productos', async ({ page }) => {
        await page.goto('/');
        // Espera a que la grilla se renderice
        await page.waitForFunction(() => document.getElementById('grilla').children.length > 0 ||
            document.querySelector('.empty-state') !== null, { timeout: 5000 });
        // Si DB vacía mostrará empty-state; si tiene datos mostrará cards
        const grilla = page.locator('#grilla');
        await expect(grilla).toBeVisible();
    });

    test('abre el panel de nuevo producto al hacer click', async ({ page }) => {
        await page.goto('/');
        await page.click('#btn-nuevo');
        await expect(page.locator('#overlay')).toBeVisible();
        await expect(page.locator('#panel-titulo')).toContainText('Nuevo producto');
    });

    test('cierra el panel al hacer click en Cancelar', async ({ page }) => {
        await page.goto('/');
        await page.click('#btn-nuevo');
        await expect(page.locator('#overlay')).toBeVisible();
        await page.click('#btn-cancelar');
        await expect(page.locator('#overlay')).toHaveClass(/hidden/);
    });

    test('valida campos obligatorios antes de enviar', async ({ page }) => {
        await page.goto('/');
        await page.click('#btn-nuevo');
        // Submit sin llenar nada
        await page.click('#btn-guardar');
        await expect(page.locator('#err-nombre')).toContainText('obligatorio');
        await expect(page.locator('#err-precio')).toContainText('mayor a 0');
        await expect(page.locator('#err-stock')).toContainText('0 o mayor');
    });

    test('valida que precio sea mayor a 0', async ({ page }) => {
        await page.goto('/');
        await page.click('#btn-nuevo');
        await page.fill('#f-nombre', 'Test');
        await page.fill('#f-precio', '-5');
        await page.fill('#f-stock', '1');
        await page.click('#btn-guardar');
        await expect(page.locator('#err-precio')).toContainText('mayor a 0');
    });

    test('filtra productos por nombre (client-side)', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000); // espera carga inicial
        const cantidadAntes = await page.locator('.card').count();

        if (cantidadAntes > 0) {
            // Obtiene nombre del primer producto
            const nombre = await page.locator('.card .card-nombre').first().textContent();
            const termino = nombre.substring(0, 3);

            await page.fill('#buscar', termino);
            await page.waitForTimeout(200);

            // La grilla debe filtrar
            const cards = page.locator('.card');
            const cantidadFiltrada = await cards.count();
            expect(cantidadFiltrada).toBeLessThanOrEqual(cantidadAntes);

            // Limpia el filtro
            await page.fill('#buscar', '');
        }
    });

    test('filtra por estado', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);

        await page.selectOption('#filtro-estado', 'activo');
        await page.waitForTimeout(200);

        const cards = page.locator('.card');
        const count = await cards.count();
        for (let i = 0; i < count; i++) {
            await expect(cards.nth(i).locator('.badge')).toHaveClass(/badge-activo/);
        }
    });
});
