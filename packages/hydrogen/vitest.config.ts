import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const packageRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(packageRoot, '../..')

// Test the candidate workspace sources rather than the published versions
// pinned in package.json, so SDK changes spanning core/react/schema and
// Hydrogen are verified together before release. `package:check` separately
// verifies the packed packages against their real dependency pins.
export default defineConfig({
  root: packageRoot,
  resolve: {
    alias: {
      '@weaverse/core': resolve(repoRoot, 'packages/core/src/index.ts'),
      '@weaverse/react': resolve(repoRoot, 'packages/react/src/index.ts'),
      '@weaverse/schema': resolve(repoRoot, 'packages/schema/src/index.ts'),
      react: resolve(repoRoot, 'node_modules/react'),
      'react-dom': resolve(repoRoot, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'node',
    pool: 'forks',
    isolate: true,
    testTimeout: 30_000,
    include: ['test/**/*.test.{ts,tsx}', '__tests__/**/*.test.{ts,tsx}'],
  },
})
