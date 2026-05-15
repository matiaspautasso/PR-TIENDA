import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tiendatec/test/e2e',
    testMatch: '**/*.spec.mjs',
    use: {
        baseURL: 'http://localhost:3000',
        headless: true,
    },
    webServer: {
        command: 'node tiendatec/servidor.mjs',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 15000,
    },
});
