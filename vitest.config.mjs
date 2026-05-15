import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: [
            'tiendatec/test/unit/**/*.test.mjs',
            'tiendatec/test/integration/**/*.test.mjs',
        ],
        environment: 'node',
        clearMocks: true,
    },
});
