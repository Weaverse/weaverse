# Feature: Dynamic Component Labels

| Field            | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| **Status**       | in-progress                                                            |
| **Owner**        | @hta218                                                                |
| **Issue**        | [#530](https://github.com/Weaverse/weaverse/issues/530)                |
| **Branch**       | `feat/dynamic-component-labels`                                         |
| **Created**      | 2026-09-29                                                             |
| **Last Updated** | 2026-09-30                                                             |

## Initiating Requirement

> Implement Weaverse/weaverse issue #530: let a component schema declare a data-driven label for individual section and child-component instances, so Studio can later show names such as a tile's heading instead of the static component title.
>
> Agreed API:
>
> ```ts
> createSchema({ type: 'tile', title: 'Tile', label: (data) => data.heading })
> ```
>
> - Add an optional `label` to the public component schema: a synchronous callback that receives the instance's settings and returns plain text. Keep `title` required as the static component name and fallback. The public API is `label`, not `sectionName`. No async callbacks and no JSX.
> - Existing schemas must remain compatible. Derived labels are never persisted to page data or the database.
> - Out of scope: the Studio bridge and outline UI, database migrations, new editor settings, and children-limit changes. Do not claim end-to-end Studio support.

## Scope Updates

### 2026-09-30 — Scope correction (supersedes all 2026-09-29 runtime requirements)

> - The SDK only declares `label` in `@weaverse/schema`: the `SchemaType.label` type, a minimal `ElementSchema` validation that accepts and preserves a function without invoking it and rejects non-functions, focused tests, package docs, and `api-reports/schema.api.md`. No `schemaBuilder().label()` helper; the only API is the `createSchema` object field.
> - No runtime changes in `@weaverse/core`, `@weaverse/react`, `@weaverse/hydrogen`, or `@weaverse/next`: no resolver, getter, `item.label`, `getItemLabel`, or data-lifecycle changes. No dependency aliases, test harness, or report-script changes. The SDK never evaluates the callback.
> - All evaluation belongs to a later Builder/Studio bridge issue: the bridge obtains the effective element data for the current preview locale (including existing translations and drafts), evaluates the callback locally, handles `title` fallback, errors, and invalid or async results, and sends the string to Studio, which renders it. No translation-engine or data-replacement changes; no global auto-detection or configuration — per-element schema opt-in only.
> - Only a `@weaverse/schema` release is needed for this PR. Adapter dependency pins and Builder integration are outside scope.

## Summary

Adds an optional `label: (data) => string | null | undefined` field to component schemas in `@weaverse/schema`, validated and preserved but never invoked by the SDK. A follow-up Studio bridge will evaluate it against the current instance data to show instance-specific names, falling back to `title`. Studio does not display these labels yet.
