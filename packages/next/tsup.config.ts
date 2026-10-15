import type { Plugin } from 'esbuild'
import { defineConfig, type Options } from 'tsup'

/**
 * `src/client-boundary.ts` holds every root export that must run as client
 * code. It is built as its own file under a `'use client'` banner, and the
 * root entry imports it as an external file rather than inlining it, so a
 * Server Component importing `@weaverse/next` never evaluates React client
 * APIs. Bundling drops module-level directives, which is why the banner is
 * applied to the built file instead of relying on the sources' own.
 */
const CLIENT_BOUNDARY = /^\.\/client-boundary$/

function externalClientBoundary(): Plugin {
  return {
    name: 'external-client-boundary',
    setup(build) {
      // tsup emits CJS through an ESM pass, so `format` cannot tell the two
      // apart; the per-format output extension can.
      let extension = build.initialOptions.outExtension?.['.js'] ?? '.js'
      build.onResolve({ filter: CLIENT_BOUNDARY }, () => ({
        path: `./client-boundary${extension}`,
        external: true,
      }))
    },
  }
}

const shared: Options = {
  format: ['esm', 'cjs'],
  sourcemap: true,
  outDir: 'dist',
  treeshake: true,
  external: ['next', 'next/navigation'],
}

export default defineConfig([
  {
    ...shared,
    entry: ['src/index.ts', 'src/server.ts'],
    dts: true,
    esbuildPlugins: [externalClientBoundary()],
  },
  {
    ...shared,
    entry: ['src/client-boundary.ts'],
    banner: { js: "'use client'" },
    // Rollup tree-shaking strips module-level directives, banner included.
    treeshake: false,
  },
])
