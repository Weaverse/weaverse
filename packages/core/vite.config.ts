import { defineConfig } from 'vite-plus'
import rootConfig from '../../vite.config'

export default defineConfig({
  ...rootConfig,
  pack: {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    sourcemap: true,
    fixedExtension: false,
    dts: false,
    // `@weaverse/core` bundles React (it declares no dependencies). Inlined
    // CommonJS keeps React's `(exports) => { exports.x = ... }` wrappers, and
    // Node's CommonJS export lexer would then report React's API as named
    // exports of `dist/index.js`. Renaming non-top-level bindings, without
    // compressing or reformatting, keeps the CommonJS named exports equal to
    // the ESM exports.
    minify: {
      compress: false,
      mangle: { toplevel: false, keepNames: true },
      codegen: { removeWhitespace: false },
    },
  },
})
