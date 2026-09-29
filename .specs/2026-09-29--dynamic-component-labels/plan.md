# Implementation Plan — Dynamic Component Labels (#530)

## Chosen approach

A **computed getter** on the Core item store. No stored label, no new
subscriptions, no serialization.

Alternatives rejected:

| Option | Why not |
| --- | --- |
| Store resolved label on item data / page payload | Violates "no derived-label persistence"; goes stale on edits/undo. |
| Push labels to Studio via a new subscription/emitter | Extra background work per edit; the bridge is out of scope; older Studio clients would ignore it anyway. |
| Resolve in each framework adapter (Hydrogen, Next) | Duplicated logic; both item stores already extend `WeaverseItemStore` and keep `schema` on the element registry entry. |

## Contract

```ts
// @weaverse/schema — SchemaType
label?: (data: Record<string, any>) => string | null | undefined
```

- Synchronous, plain text. `title` stays required (Add menu name + fallback).
- `ElementSchema` (Zod) accepts only a function; any other value is a
  validation issue reported by dev-only `createSchema` validation.
- `SchemaBuilder.label(fn)` for builder parity; `mergeSchemas` needs no change
  (object spread = last override wins).
- `CreateHydrogenSchemaOptions.label` repeats the callback type inline.
  `SchemaType['label']` is not possible yet: Hydrogen's declaration build
  (`scripts/build-declarations.mjs`) compiles against the pinned published
  `@weaverse/schema@0.16.0`, which predates `label` (`TS2339`). A typechecked
  test (`expectTypeOf`) keeps the inline type equal to
  `HydrogenComponentSchema['label']`.

```ts
// @weaverse/core
class WeaverseItemStore {
  /** Resolved label; falls back to schema title, then type. */
  get label(): string
}
class Weaverse {
  /** Resolved label for a live item ID, or undefined when no store exists. */
  getItemLabel(id: string): string | undefined
}
```

Resolution (`WeaverseItemStore.label`):

1. `schema = this.Element?.schema`; `fallback = schema?.title || this._store.type`.
2. If `typeof schema?.label !== 'function'` → `fallback`.
3. `value = schema.label(this.getSnapShot())` inside `try/catch`.
   `getSnapShot()` is the same data the component renders with: flattened
   settings + schema defaults, and the translation overlay in Hydrogen/Next.
4. Thenable result (promise, async function, custom thenable) →
   `Promise.resolve(value).catch(() => undefined)` so a rejection is observed,
   then return `fallback`. The result is never applied later.
5. `typeof value === 'string' && value.trim()` → return the trimmed text,
   else `fallback` (empty, whitespace, numbers, objects, JSX).
6. Thrown error → `console.warn` with type and ID, return `fallback`.

## Freshness and lifecycle fixes

- Edits / undo / redo: Studio applies them through `item.setData()`; the
  getter reads the current store on every call.
- Duplication: Studio creates a new store with its own ID.
- Repeated same type: each store passes its own snapshot to the shared callback.
- Hydrogen page/locale changes (`packages/hydrogen/src/WeaverseHydrogenRoot.tsx`):
  - The constructor rebinds this page's reused item stores to the new runtime
    (`rebindPageItems`), matching Next's existing `rebindPageItemsToRuntime`.
    Only IDs in the new page data are touched; nothing is emitted.
  - `extractTranslationSidecar()` clears the sidecar when page data has none,
    matching Next's existing behavior.
- Full serialized replacements in both adapters (`id` and `type` present, as
  passed by core `initProject()` on reuse): `setData()` first drops every
  schema-declared setting name (inputs with a `name` in `settings` and the
  legacy `inspector`, with or without `defaultValue`), then applies schema
  defaults and the payload. A reused store therefore equals a fresh store
  built from the same payload, including `data: {}` and omitted `data`.
  The nested `data` copy is replaced too (Next now matches Hydrogen here).
  Store keys that are not declared settings (runtime metadata such as
  `loaderData`, `css`, `parentId`) keep the existing merge behavior.
  - Hydrogen (`WeaverseHydrogenRoot.tsx`): the clearing runs only for
    serialized items. Partial `{ data }` updates keep the existing Hydrogen
    normalization (defaults re-applied, other settings kept).
  - Next (`packages/next/src/item.ts`): partial edits, `{ loaderData }`
    updates, `{}` context refreshes, and partial `{ data }` updates carry no
    `id`/`type` and keep merging. Deferred-emit handling is unchanged.
  - The `generateDataFromSchema` helpers are unchanged; the declared-name
    lookup is a private function in each adapter's item file.

## Effect on normal rendering

The label callback never runs during rendering; only `item.label` /
`getItemLabel()` invoke it. The lifecycle fixes do change rendering of reused
item stores, as bug fixes:

- Hydrogen: after a same-page runtime replacement, reused items read the new
  runtime (its translation sidecar and runtime fields) instead of the old one.
  Page data without a sidecar no longer keeps overlaying old translations.
  Sidecars exist only in design mode, so live storefronts normally have an
  empty map either way.
- Both adapters: a reused item receiving a full payload that omits a declared
  setting now renders the schema default, or no value if the setting has no
  default, instead of the previous page/locale value. Stale schema-defined
  settings no longer survive a full replacement. In Next, the store's nested
  `data` copy now follows the latest payload.

## Bridge contract (separate follow-up, not implemented here)

- Runtime: Hydrogen `window.__weaverse` (`WeaverseHydrogen`); Next the
  `WeaverseNextRuntime` bound to Studio.
- Read `runtime.getItemLabel(itemId)` (or `runtime.itemInstances.get(id)?.label`)
  for each outline item after applying an update. Labels are pull-based; there
  is no change event. Runtimes without `getItemLabel` → use schema `title`.
  Older Studio clients never call it → no behavior change.

## Test and type resolution

- Hydrogen and Next pin published `@weaverse/core`/`react`/`schema`.
  `packages/hydrogen/vitest.config.ts` (new) and the existing
  `packages/next/vitest.config.ts` alias them to the candidate workspace
  sources; both package `test` scripts pass `--config vitest.config.ts`.
- `packages/{hydrogen,next}/tsconfig.json` map `@weaverse/core|react|schema`
  to workspace sources, so `tsc --noEmit -p` checks the candidate contract.
  Hydrogen additionally includes `__tests__/item-label.test.ts` (other
  Hydrogen tests have pre-existing type errors and stay excluded).
- `scripts/build-declarations.mjs` already clears `paths`, and
  `scripts/api-reports.mjs` now drops `@weaverse/*` paths, so builds and API
  reports still resolve sibling packages through their pins.
- The root-level `vp test` runner (the `test:run` script) uses the root config without these aliases.
  Adapter tests are supported only through `pnpm run test` (per-package), as
  was already the case for Next.

## Tests

| File | Cases |
| --- | --- |
| `packages/schema/test/component-label.test.ts` | function accepted and not invoked; non-function rejected; `schemaBuilder().label()` |
| `packages/core/__tests__/item-label.test.ts` | no callback → title; trimmed text; empty/whitespace/number/object/null/undefined/promise → title; rejected promise, async throw, rejecting thenable → title with no unhandled rejection (plain callbacks, since `vi.fn()` observes promises itself); async resolution never applied later; throw → title; missing title → type; same type, different data; `setData` updates; callback not run unless read; unknown ID → `undefined` |
| `packages/hydrogen/__tests__/item-label.test.ts` | `CreateHydrogenSchemaOptions['label']` equals `HydrogenComponentSchema['label']` (type); nested data; reused item after `setProjectData`; new runtime with a different sidecar; `setProjectData` without sidecar clears translations; settings without defaults (via `settings` and legacy `inspector`): full payload with `data: {}` / omitted `data` → `title`, populated → empty → populated, reused store equals fresh store, `{ loaderData }` keeps settings. Schemas built with the public Hydrogen `createSchema` |
| `packages/next/__tests__/item-label.test.ts` | `WeaverseNextComponent['schema']['label']` and `WeaverseNextRuntime['getItemLabel']` types; nested data; edit; full payload with `data: {}` and without `data` → default; repeated transitions; partial edit keeps other settings; `{}` keeps settings and swaps the store; `{ loaderData }` keeps settings; settings without defaults (via `settings` and legacy `inspector`): full payload with `data: {}` / omitted `data` → `title`, populated → empty → populated, reused store equals fresh store, partial `{ data }` keeps settings |

## Docs

- `packages/schema/README.md`: `label` in the schema type listing and a
  "Dynamic instance labels" section marked as SDK groundwork (Studio does not
  show labels yet).

## Release sequencing

No versions, pins, or lockfile change here. For published consumers:

1. Release `@weaverse/schema` with the new `label` contract.
2. Update Hydrogen's `@weaverse/schema` pin to that release, then release
   the fixed core/react/hydrogen group with its internal pins aligned. The
   inline Hydrogen type can then become `SchemaType['label']`.
3. Update Next's `@weaverse/react@5.20.3` and schema dependency pins to the
   releases containing the new runtime and schema contracts, verify the
   packed consumer, and release Next separately.

`pnpm run package:check` verifies packed packages against their real pins and
does not prove that those pins contain this feature.

## Verification commands

```sh
(cd packages/core && pnpm exec vp test --run __tests__/item-label.test.ts)
(cd packages/schema && pnpm exec vp test --run test/component-label.test.ts)
(cd packages/hydrogen && pnpm exec vp test --run --config vitest.config.ts __tests__/item-label.test.ts)
(cd packages/next && pnpm exec vp test --run --config vitest.config.ts __tests__/item-label.test.ts)
pnpm exec turbo test --force --filter=@weaverse/core --filter=@weaverse/schema --filter=@weaverse/react --filter=@weaverse/hydrogen --filter=@weaverse/next
for p in core schema react hydrogen next; do pnpm exec tsc --noEmit -p packages/$p/tsconfig.json; done
pnpm exec biome ci .
pnpm run api:report   # intended additions only
pnpm run package:check
```

## Files and folders touched

- `.specs/2026-09-29--dynamic-component-labels/` (README, plan, work-logs)
- `packages/schema/src/validation.ts`: `SchemaType.label`, `ElementSchema.label`
- `packages/schema/src/index.ts`: `SchemaBuilder.label()`
- `packages/schema/test/component-label.test.ts` (new)
- `packages/schema/README.md`
- `packages/core/src/core.ts`: `WeaverseItemStore.label`, `Weaverse.getItemLabel`
- `packages/core/__tests__/item-label.test.ts` (new)
- `packages/hydrogen/src/types.ts`: `CreateHydrogenSchemaOptions.label`
- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`: page-scoped rebind, sidecar clearing, declared-setting clearing on full replacement
- `packages/hydrogen/vitest.config.ts` (new), `packages/hydrogen/package.json` (`test` script), `packages/hydrogen/tsconfig.json`
- `packages/hydrogen/__tests__/item-label.test.ts` (new)
- `packages/next/src/item.ts`: full-payload normalization (declared-setting clearing, defaults, nested `data` replacement)
- `packages/next/tsconfig.json`
- `packages/next/__tests__/item-label.test.ts` (new)
- `scripts/api-reports.mjs`: drop `@weaverse/*` source paths for reports
- `api-reports/core.api.md`, `hydrogen.api.md`, `schema.api.md`

Not touched: Builder, manifest format (`label` is runtime-only and not
serializable), versions, pins, lockfile, `templates/`, `archived/`.
