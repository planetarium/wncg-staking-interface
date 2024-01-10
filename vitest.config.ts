import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['node_modules', '/node_modules/(?!(hex-rgb)/)'],
    clearMocks: true,
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
    },
    include: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  },
})
