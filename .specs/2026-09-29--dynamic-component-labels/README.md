# Feature: Dynamic Component Labels

| Field            | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| **Status**       | in-progress                                                            |
| **Owner**        | @hta218                                                                |
| **Issue**        | [#530](https://github.com/Weaverse/weaverse/issues/530)                |
| **Branch**       | `feat/dynamic-component-labels`                                         |
| **Created**      | 2026-09-29                                                             |
| **Last Updated** | 2026-09-29                                                             |

## Initiating Requirement

> Implement Weaverse/weaverse issue #530: support data-driven labels for individual section and child-component instances, delivering the SDK contract before Studio integration.
>
> Agreed API:
>
> ```ts
> createSchema({ type: 'tile', title: 'Tile', label: (data) => data.heading, ... })
> ```
>
> - Add an optional `label` to the public component schema: a synchronous callback that receives the instance's per-instance settings and returns plain text. Keep `title` required as the static component name for Add menus and as the fallback. The public API is `label`, not `sectionName`. No async callbacks and no JSX.
> - Fall back to `title` when the callback is absent, returns empty/whitespace/non-string/invalid output, or throws. A failing callback must not break editing.
> - Resolve labels inside the preview runtime using the local schema and the current instance data. Expose the resolved string per item ID for the later Studio bridge. Do not serialize/`eval` callbacks and do not persist derived labels to page data or the database.
> - Support Hydrogen and Next.js. Existing schemas and older Studio clients must remain compatible. Do not change published storefront rendering, and do not execute label callbacks during normal non-design rendering.
> - Labels read by the bridge must reflect current settings after edits, undo/redo, duplication, and repeated page/locale navigation. Keep it simple and reuse existing SDK runtime integration points; prefer a computed getter over stored data or extra subscriptions.
> - Update schema validation, public types/API reports, SDK runtime, and docs/examples as appropriate. Focused tests must cover fallback/errors, repeated component types with different data, and changed data. Avoid broad refactors, version bumps, and lockfile changes.
> - Out of scope: the Studio bridge and outline UI (a separate follow-up), any Studio prototype or duplicated engine, new editor settings, database migrations, and children-limit changes. Do not claim end-to-end Studio support.

## Scope Updates

### 2026-09-29

> - A label callback that returns a rejected promise, throws asynchronously, or returns a rejecting thenable must fall back to `title` without producing an unhandled rejection. The resolver stays synchronous, and an async result must never be applied as a label later.
> - Hydrogen: when a new runtime for the same page reuses item stores (for example a locale switch), labels and snapshots must read the new runtime's translation sidecar. Page data without a sidecar, applied through `setProjectData()`, must clear the previous sidecar. Fix only the lifecycle needed for current snapshots; no global registry refactor and no render-phase update warnings.
> - Next.js: a full serialized item applied to a reused store (`setProjectData()` / runtime reuse) must re-apply schema defaults for omitted settings, including a payload with `data: {}` or no `data`, across repeated transitions. Partial setting edits, loader-data updates, empty context refreshes, and deferred emits keep their existing semantics.
> - Adapter label tests must run for real in the normal package test command against the candidate workspace sources (no self-skipping tests). `tsc --noEmit -p packages/<adapter>/tsconfig.json` must pass uncached and must typecheck the public `createSchema`, `HydrogenComponentSchema`, and Next registration/runtime label contracts. Packed-consumer verification stays separate, because local source resolution does not prove that the pinned published dependencies contain the feature. No pin, version, or lockfile changes; document the release sequencing instead.
> - Full serialized replacements in both adapters must clear omitted schema-declared settings, including settings without a `defaultValue`, so a reused store resolves the same label as a fresh store built from the same payload (for example `title` for `data: {}` or omitted `data`). Partial edits, partial `{ data }` updates, loader-data updates, context refreshes, runtime metadata, and deferred emits keep their semantics. The legacy `inspector` key must not regress.
> - Reference `SchemaType['label']` from Hydrogen if the build allows it. Documentation must present this as SDK groundwork and must not imply that Studio already shows the labels.

## Summary

Adds an optional `label(data)` callback to component schemas and a computed, never-persisted label resolver in the Core item store (`item.label`, `weaverse.getItemLabel(id)`), inherited by the Hydrogen and Next item stores. A later Studio integration can show instance-specific names such as a tile's heading, falling back to the static `title` whenever the callback is absent or misbehaves. Studio does not display these labels yet.

## Delivery State

SDK implementation and local verification are complete. Package releases and dependency-pin updates remain separate gates; the Studio bridge and outline integration are not included.
