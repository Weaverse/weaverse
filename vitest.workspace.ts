import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: '@weaverse/hydrogen',
      root: './packages/hydrogen',
      globals: true,
      environment: 'node',
      include: ['__tests__/**/*.test.ts'],
    },
  },
  {
    test: {
      name: '@weaverse/i18n',
      root: './packages/i18n',
      globals: true,
      environment: 'node',
      include: ['__tests__/**/*.test.ts'],
    },
  },
  // Add more package configs here as needed
])
