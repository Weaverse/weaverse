# Run zod jitless in @weaverse/schema

Issue: [#595](https://github.com/Weaverse/weaverse/issues/595)

## Outcome

Storefronts whose Content Security Policy has no `'unsafe-eval'` stop logging a CSP violation report on every page load. Zod v4 probes JIT support with `new Function('')` when it builds an object schema; the throw is caught, so nothing breaks, but the browser still reports it.

## Scope & contract

- `@weaverse/schema` calls `z.config({ jitless: true })` at the top of `src/validation.ts`, before any schema is built. Every zod use in the package goes through that module: `index` re-exports from it and `manifest` imports it.
- Zod skips the probe under `jitless` only from 4.4.0, so the `zod` range moves from `^4.3.6` to `^4.4.0`.
- `jitless` is zod's global config: an app that shares the same zod instance also parses without the JIT fast path.
- Non-goals: removing zod from storefront bundles.

## Acceptance

- Importing `@weaverse/schema` leaves `z.config().jitless === true`.
- The call is present in the built validation chunk (ESM and CJS), ahead of the first schema.

## Approach

- One top-level call in `src/validation.ts`. It is a statement in a module consumers keep whenever they use any of its exports, so `"sideEffects": false` stays.

## Verification

- `test/zod-jitless.test.ts` fails without the call and passes with it.
- `pnpm run biome`, `typecheck`, `test`, `build` and `api:check` pass.
- Storefronts get the fix once a schema release is followed by a Hydrogen release that moves its pinned `@weaverse/schema` version.

## Files

- `packages/schema/src/validation.ts`, `test/zod-jitless.test.ts`, `package.json`
- `pnpm-lock.yaml`
