import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const packageRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(packageRoot, '../..')

export default defineConfig({
  root: packageRoot,
  resolve: {
    alias: {
      '@weaverse/core': resolve(repoRoot, 'packages/core/src/index.ts'),
      '@weaverse/react': resolve(repoRoot, 'packages/react/src/index.ts'),
      '@weaverse/schema': resolve(repoRoot, 'packages/schema/src/index.ts'),
      // `next` is a peerDependency, not installed in this monorepo. Resolve the
      // single `next/navigation` import to a local shim for tests.
      'next/navigation': resolve(
        packageRoot,
        '__tests__/__mocks__/next-navigation.ts'
      ),
      '~': resolve(repoRoot, 'packages/react/src'),
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
  test: {
    environment: 'node',
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
})
