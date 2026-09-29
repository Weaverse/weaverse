# Work Logs

## 2026-09-29 — Initial implementation

### Context

- Baseline: `main` at `143227a3`, clean. No existing spec covered instance
  labels; the closest precedent is
  `.specs/2026-07-23--function-based-component-availability/` (schema callback
  preserved by the SDK), which covers a different outcome (availability).
- Both `WeaverseHydrogenItem` and `WeaverseNextItem` extend Core's
  `WeaverseItemStore`, and both adapters register `{ type, Component, schema }`
  in the element registry, so a single Core getter serves both.
- Studio duplicates items by creating new item stores directly, and
  `Weaverse.itemInstances` is process-wide (spans previous pages). A per-ID
  lookup is therefore the safe exposure; a bulk map over `data.items` or
  `itemInstances` was rejected (stale or missing entries).

### Decisions

- Computed `WeaverseItemStore.label` getter + `Weaverse.getItemLabel(id)`.
  No stored label, no subscription, no manifest field (callbacks are not
  serializable; the manifest schema is strict and unchanged).
- The callback receives `getSnapShot()`, i.e. exactly what the component
  renders with (flattened settings + defaults + translation overlay).
- Output is trimmed; non-string, empty, whitespace, Promise, or JSX values and
  thrown errors fall back to `title`, then `type`. Errors log a `console.warn`
  with type and ID.
- `CreateHydrogenSchemaOptions.label` uses an inline type because Hydrogen
  type-checks against the published `@weaverse/schema@0.16.0` pin
  (`SchemaType['label']` failed: `TS2339: Property 'label' does not exist on type 'SchemaType'`).
- The implementation plan follows the repository SDD convention and lives
  in this folder.

### TDD evidence

RED (tests written before implementation):

```sh
pnpm exec vp test --run packages/schema/test/component-label.test.ts packages/core/__tests__/item-label.test.ts packages/hydrogen/__tests__/item-label.test.ts packages/next/__tests__/item-label.test.ts
```

- 21 failed / 1 passed. Core, Hydrogen, Next: `TypeError: weaverse.getItemLabel is not a function`
  (`runtime.getItemLabel` for Next). Schema: all 3 failed (Zod stripped
  `label`; `schemaBuilder().label` missing). The passing case is the guard
  `should_not_invoke_callback_when_label_is_not_read`, which is green by design.

GREEN after implementation, same command: schema 3/3 and core 15/15 passed.
Hydrogen still failed with the same `TypeError`, as did Next under the root
config, even after `pnpm exec turbo build --filter=@weaverse/core --filter=@weaverse/react --filter=@weaverse/schema`.
Cause: Hydrogen and Next resolve the **published** `@weaverse/core`/`react`
from npm (`node_modules/@weaverse/*` are registry installs; Next pins
`@weaverse/react@5.20.3`), not workspace sources.

- Next: `(cd packages/next && pnpm exec vp test --run __tests__/item-label.test.ts)`
  uses Next's own Vitest config, which aliases local core/react sources:
  **2 passed**.
- Hydrogen: passed only through a temporary, non-committed alias config, and
  the committed suite self-skipped with `describe.skipIf`. Both were replaced
  in the follow-up entry below and are not valid evidence.

### Checks

| Command | Result |
| --- | --- |
| `pnpm exec turbo test --filter=@weaverse/core --filter=@weaverse/schema --filter=@weaverse/hydrogen --filter=@weaverse/next` | core 18 passed; schema 72 passed; next 158 passed; hydrogen 206 passed, 2 skipped (label suite guard) |
| `pnpm exec turbo typecheck --filter=@weaverse/core --filter=@weaverse/schema --filter=@weaverse/hydrogen --filter=@weaverse/next --filter=@weaverse/react` | reported pass, but from Turbo cache; an uncached `tsc` for Next failed (see follow-up) |
| `pnpm exec biome ci .` | 0 errors, 346 warnings, all pre-existing categories; new `any` uses carry `biome-ignore` like neighboring code |
| `pnpm run api:report` | only intended additions: core `WeaverseItemStore.label`, `Weaverse.getItemLabel`; schema `SchemaType.label`, `ElementSchema.label` (Zod), `SchemaBuilder.label`; hydrogen `CreateHydrogenSchemaOptions.label` |
| `pnpm run package:check` | `Verified 8 packed packages and 10 TypeScript entrypoints`. Note printed: `@weaverse/next>@weaverse/react@5.20.3 does not accept packed 5.21.2` (pre-existing pin) |

### Remaining limits

- Hydrogen and Next get the runtime resolver only after the fixed-group
  release and a dependency pin bump. Next's pin is `5.20.3`, so it needs a bump
  as well. No versions or lockfile were changed here.
- Studio bridge/outline consumption is a separate follow-up and is not implemented, so
  end-to-end Studio behavior is unverified.
- Labels are pull-based: the bridge must re-read `getItemLabel(id)` after it
  applies edits, undo/redo, duplication, or navigation. There is no push event.

## 2026-09-29 — Review follow-up

Fixed contract failures found in review. Each bug got a failing test first.

### RED evidence

| Command | Result before fix |
| --- | --- |
| `(cd packages/core && pnpm exec vp test --run __tests__/item-label.test.ts)` | 2 failed: rejected promise and async throw each raised `unhandledRejection` (`expected { label: 'Tile', unhandled: 1 }`). The first version of these tests passed wrongly: `vi.fn()` observes returned promises for `settledResults` and hid the leak, so the fixtures now use plain callbacks. A standalone Node script against built core printed the fallback and then an unhandled rejection. |
| `(cd packages/hydrogen && pnpm exec vp test --run --config vitest.config.ts __tests__/item-label.test.ts)` | 2 failed: `expected 'Français' to be 'Übersetzt'` (second runtime reusing the item) and `expected 'Français' to be 'Summer sale'` (`setProjectData` without sidecar) |
| `(cd packages/next && pnpm exec vp test --run --config vitest.config.ts __tests__/item-label.test.ts)` | 3 failed: `expected 'Old locale' to be 'Default tile'` (`data: {}` and omitted `data`), and repeated transitions `[ 'Français', 'Français', 'Deutsch' ]` |
| `pnpm exec tsc --noEmit -p packages/next/tsconfig.json` | `TS2353 'label' does not exist in type 'SchemaType'`, `TS2339 'getItemLabel' does not exist on type 'WeaverseNextRuntime'` (the earlier Turbo pass was cached) |

### Fixes

- Core: thenable results are observed with `Promise.resolve(value).catch(...)`
  and fall back to `title`; never applied later. The resolver stays synchronous.
- Hydrogen: the constructor rebinds this page's reused item stores to the new
  runtime (same approach as Next's `rebindPageItemsToRuntime`), and
  `extractTranslationSidecar()` clears the sidecar when page data has none
  (Next already did this). Neither change emits updates.
- Next: `WeaverseNextItem.setData()` re-applies schema defaults for full
  serialized items (`id` + `type`), like Hydrogen. Partial edits,
  `{ loaderData }`, and `{}` refreshes are unchanged.
- Durable resolution: new `packages/hydrogen/vitest.config.ts` aliases
  `@weaverse/core|react|schema` to workspace sources (like Next's), and the
  Hydrogen `test` script uses it. The `describe.skipIf` guard is removed.
  `packages/{hydrogen,next}/tsconfig.json` map the same packages to sources;
  Hydrogen also includes `__tests__/item-label.test.ts`. Including all
  Hydrogen tests surfaced 9 pre-existing type errors in
  `weaverse-client.test.ts` and `sync-reused-instance.test.ts`, so they stay
  excluded.
- `pnpm run api:report` then crashed in API Extractor
  (`Unable to determine semantic information for declaration: packages/react/src/hooks.ts:61:7`)
  because it read the new source `paths`. `scripts/api-reports.mjs` now
  drops `@weaverse/*` paths via `overrideTsconfig`, like
  `build-declarations.mjs`, which already clears `paths`.
- Hydrogen `label` type: `SchemaType['label']` broke `pnpm run build` for
  Hydrogen (`src/types.ts:831:22 TS2339: Property 'label' does not exist on
  type 'SchemaType'`), because the declaration build compiles against the
  pinned `@weaverse/schema@0.16.0`. The inline type stays, with a comment,
  and a typed test asserts it equals `HydrogenComponentSchema['label']`.
  Mutating the inline return type to `string` made `tsc` fail with `TS2344`;
  the mutation was then reverted.
- Schema README: the label section is marked as SDK groundwork. Studio does
  not display labels yet.

### Checks (after fixes)

| Command | Result |
| --- | --- |
| `pnpm exec turbo test --force --filter=@weaverse/core --filter=@weaverse/schema --filter=@weaverse/react --filter=@weaverse/hydrogen --filter=@weaverse/next` | core 22 passed; schema 72 passed; react 91 passed, 1 skipped (pre-existing `it.skip` in `data-connector.test.ts`); next 165 passed; hydrogen 211 passed |
| `pnpm exec tsc --noEmit -p packages/<pkg>/tsconfig.json` for core, schema, react, hydrogen, next | all pass, no output |
| `pnpm exec biome ci .` | 0 errors; warnings only |
| `pnpm run api:report` | exit 0; diff limited to the intended `label` / `getItemLabel` / `SchemaBuilder.label` / `ElementSchema.label` / `CreateHydrogenSchemaOptions.label` additions |
| `pnpm run package:check` | exit 0, `Verified 8 packed packages and 10 TypeScript entrypoints`; prints `@weaverse/next>@weaverse/react@5.20.3 does not accept packed 5.21.2` |

### Remaining limits

- Release sequencing (see plan): published Hydrogen needs its
  `@weaverse/schema` pin moved, and Next needs its `@weaverse/react@5.20.3`
  pin moved, before consumers get this feature. Local source aliases and
  `package:check` do not prove that.
- The root-level `vp test` runner (the `test:run` script) does not use the adapter aliases. The new
  adapter label tests fail there, and 8 Next adapter tests already failed
  there on the unmodified baseline. `pnpm run test` (per-package) is the
  supported path.
- Settings without a `defaultValue` that a new full payload omits keep their
  previous value in both adapters. (Fixed in the next entry.)
- End-to-end Studio behavior is unverified until the bridge/outline follow-up.

## 2026-09-29 — Full replacement of settings without defaults

A second review found that a reused store kept schema settings without a
`defaultValue` when a full payload omitted them. Example: a `Tile` schema
(`label: (data) => data.heading`, `heading` has no default), built with
`heading: 'Old locale'`, then given a full payload with `data: {}`. The reused
store still returned `Old locale`, while a fresh store built from the same
payload returned `Tile`. The previously documented limit was not an approved
exemption.

### RED evidence

| Command | Result before fix |
| --- | --- |
| `(cd packages/hydrogen && pnpm exec vp test --run --config vitest.config.ts __tests__/item-label.test.ts)` | 5 failed / 6 passed: `expected 'Old locale' to be 'Tile'` for `data: {}`, omitted `data`, and legacy `inspector`; `expected [ 'A', 'B', 'B' ] to deeply equal [ 'Tile', 'B', 'Tile' ]`; reused store ≠ fresh store (`…(5)` vs `…(4)` keys) |
| `(cd packages/next && pnpm exec vp test --run --config vitest.config.ts __tests__/item-label.test.ts)` | 5 failed / 10 passed: the same three `'Old locale'` cases, `[ 'A', 'B', 'B' ]`, reused ≠ fresh (`…(4)` vs `…(3)` keys) |

The first GREEN run for Next still failed the fresh-vs-reused test: the store's
nested `data` kept `{ heading: 'Old' }` because the Next constructor stores the
payload's nested `data` and the reuse path never replaced it. The fix now
replaces it, as Hydrogen already did.

### Fix

- Both adapters, full serialized items only (`id` + `type`): drop every
  schema-declared setting name (`settings` and legacy `inspector` inputs with
  a `name`), then apply defaults and the payload. Next also replaces the nested
  `data` copy. A private `getSchemaSettingNames()` in
  `packages/hydrogen/src/WeaverseHydrogenRoot.tsx` and
  `packages/next/src/item.ts`. `generateDataFromSchema` is unchanged.
- Partial edits, partial `{ data }`, `{ loaderData }`, `{}` refreshes, and
  runtime metadata keep their previous behavior; deferred emits in Next are
  unchanged.
- Rendering effect (bug fix): after a full replacement, a reused item no longer
  renders stale values for schema-declared settings the new payload omits. It
  renders the default, or no value when there is none, exactly like a fresh
  item.

### Checks (after fix)

| Command | Result |
| --- | --- |
| `(cd packages/hydrogen && pnpm run test)` | 14 files, 217 passed |
| `(cd packages/next && pnpm run test)` | 6 files, 171 passed |
| `(cd packages/core && pnpm exec vp test --run __tests__/item-label.test.ts)` | 19 passed |
| `(cd packages/schema && pnpm exec vp test --run test/component-label.test.ts)` | 3 passed |
| `pnpm exec tsc --noEmit --incremental false -p packages/hydrogen/tsconfig.json` and `…/next/tsconfig.json` | both pass, no output |
| `pnpm exec biome ci .` | 0 errors (one import-order error in `packages/next/src/item.ts` fixed with `biome check --write`) |
| `pnpm run package:check` | exit 0, `Verified 8 packed packages and 10 TypeScript entrypoints` |

## 2026-09-29 — Final source verification

- All reported label blockers were reproduced and fixed: rejected async
  results, stale translation sidecars, and omitted settings both with and
  without defaults. Regression tests cover the corrected behavior.
- An independent source-runtime probe for both adapters verified repeated
  labels `Old locale → Tile → New locale → Tile`, and a fresh store for the
  empty payload returned `Tile` as well.
- `pnpm exec turbo test --force`: 620 passed and one existing React test
  skipped. Neither adapter's label tests skip.
- Direct `tsc --noEmit --incremental false` passed for core, schema, react,
  hydrogen, and next.
- `pnpm exec biome ci . --diagnostic-level=error` passed.
- `pnpm exec turbo build --filter='./packages/*' --force` passed with no cached
  build tasks; `pnpm run package:check` verified eight packed packages and ten
  TypeScript entrypoints.
- Release dependency alignment and Studio integration are still outstanding.
  The package check retains registry resolution for Next's old React pin;
  it is not proof that already-published dependencies contain this feature.
- Pre-commit hooks reported advisory warnings but no errors or source edits.
  New test warnings concern intentional invalid numeric/async fixtures and a
  no-op warning spy; optional runtime guards preserve defensive behavior for
  JavaScript callers. Existing type-style warnings remain out of scope.
