import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const packageRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(packageRoot, '../..')

// The flat install keeps several React copies; rendering tests must use one.
export default defineConfig({
  root: packageRoot,
  resolve: {
    alias: {
      // `next` is an optional peer; resolve the Next.js adapter's single
      // `next/navigation` import to a local shim for tests.
      'next/navigation': resolve(
        packageRoot,
        '__tests__/next/__mocks__/next-navigation.ts'
      ),
      react: resolve(repoRoot, 'node_modules/react'),
      'react-dom': resolve(repoRoot, 'node_modules/react-dom'),
      'react/jsx-dev-runtime': resolve(
        repoRoot,
        'node_modules/react/jsx-dev-runtime.js'
      ),
      'react/jsx-runtime': resolve(
        repoRoot,
        'node_modules/react/jsx-runtime.js'
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
})
