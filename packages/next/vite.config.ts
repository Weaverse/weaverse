import { defineConfig } from 'vite-plus'
import type { PackUserConfig } from 'vite-plus/pack'

/**
 * `src/client-boundary.ts` holds every root export that must run as client
 * code. It is built as its own file under a `'use client'` banner, and the
 * root entry imports it as an external file rather than inlining it, so a
 * Server Component importing `@weaverse/next` never evaluates React client
 * APIs. Bundling drops module-level directives, which is why the banner is
 * applied to the built file instead of relying on the sources' own.
 */
const CLIENT_BOUNDARY = './client-boundary'

const shared: PackUserConfig = {
  format: ['esm', 'cjs'],
  sourcemap: true,
  // `.mjs` for ESM and `.js` for CJS, matching the package's exports map.
  fixedExtension: false,
  dts: false,
  // The build script empties `dist` once; both configs write into it.
  clean: false,
  deps: { neverBundle: ['next', 'next/navigation'] },
  // Keep legal and bundler annotation comments only. Source JSDoc that merely
  // names a client package must not make server files look client-bound.
  outputOptions: { comments: { legal: true, annotation: true, jsdoc: false } },
}

export default defineConfig({
  pack: [
    {
      ...shared,
      entry: ['src/index.ts', 'src/server.ts'],
      // The boundary import must name the built file of the same format.
      inputOptions: (options, format) => ({
        ...options,
        plugins: [
          options.plugins,
          {
            name: 'external-client-boundary',
            resolveId(source) {
              return source === CLIENT_BOUNDARY
                ? {
                    id: `${CLIENT_BOUNDARY}${format === 'es' ? '.mjs' : '.js'}`,
                    external: true,
                  }
                : null
            },
          },
        ],
      }),
    },
    {
      ...shared,
      entry: ['src/client-boundary.ts'],
      banner: { js: "'use client'" },
    },
  ],
})
