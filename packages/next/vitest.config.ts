import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const packageRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(packageRoot, '../..')

export default defineConfig({
  root: packageRoot,
  resolve: {
    alias: {
      react: resolve(repoRoot, 'node_modules/react'),
      'react-dom': resolve(repoRoot, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'node',
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
})
