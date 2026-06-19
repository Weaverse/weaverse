import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  resolve: {
    alias: {
      react: resolve(repoRoot, 'node_modules/react'),
      'react-dom': resolve(repoRoot, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'node',
    include: ['packages/next/**/*.{test,spec}.{ts,tsx}'],
  },
})
