/// <reference types="vite-plus/test/optional-types.js" />
import { defineConfig } from 'vite-plus'

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'forks',
    isolate: true,
    testTimeout: 30_000,
    // Patterns are relative to cwd so they work both from the repo
    // root (`pnpm run test:run` → picks up every package) and from
    // inside a single package directory (`turbo run test` → cwd is
    // the package).
    include: [
      '**/test/**/*.test.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.test.{ts,tsx,js,jsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      'archived/**',
      'deprecated/**',
      'templates/**',
      // Demo/validation scripts that use the .test.ts suffix but
      // contain no describe/it blocks (just top-level console.log).
      '**/test/blah.test.ts',
      '**/test/enhanced-features.test.ts',
      '**/test/type-alignment.test.ts',
    ],
  },
})
