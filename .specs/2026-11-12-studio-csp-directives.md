# Export Studio CSP directives from the SDK

Issue: [#592](https://github.com/Weaverse/weaverse/issues/592)

## Outcome

Themes stop hand-rolling the Weaverse part of their Content Security Policy. `getWeaverseStudioCspDirectives(request)` returns the sources Weaverse Studio needs for the current request, ready for Hydrogen's `createContentSecurityPolicy({ directives })`. It replaces Pilot's `app/weaverse/csp.ts`, which put the raw `?weaverseHost=` query into `script-src`/`connect-src` and set `frame-ancestors *` whenever that param was present.

## Scope & contract

- Exported from `@weaverse/hydrogen` / `./react-router` and `./next/server`, with the `WeaverseStudioCspDirectives` type.
- Normal visitors get `{}`: outside Studio the browser never contacts Weaverse. Images and videos merchants upload in Studio go to their Shopify store and are served from `cdn.shopify.com`, which Hydrogen's defaults already allow.
- Inside Studio (design, preview or revision-preview markers), the Studio origin is added to `connect-src`, `font-src`, `img-src`, `script-src`, `style-src` and `frame-ancestors`. Design mode also adds `'unsafe-eval'` to `script-src`, because the bridge rebuilds schema `condition` functions from strings.
- The Studio origin comes from `resolveStudioScriptSrc`, the same gate that loads the bridge script: untrusted `weaverseHost` values, and loopback hosts on a non-loopback storefront, return `{}`. The policy and the bridge can never disagree.
- Mode-agnostic: returns directives only; the theme chooses report-only or enforcing, and merges its own sources (video embeds, analytics, fonts).
- Non-goals: building the full policy or theme-specific sources.
- Ships in 6.3.0, together with [#591](https://github.com/Weaverse/weaverse/issues/591).

## Acceptance

- `pnpm run biome`, `typecheck`, `test` and `package:check` pass; `api:check` shows only the added export and type.

## Files

- `packages/hydrogen/src/utils/studio-csp.ts`, `__tests__/studio-csp.test.ts`
- `packages/hydrogen/src/index.ts`, `src/next-server.ts`
- `packages/hydrogen/readme.md`
- `api-reports/hydrogen*.api.md`, `api-reports/runtime-exports.api.md`
