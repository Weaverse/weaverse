# Feature: Media Manager Exclude Config

| Field            | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| **Status**       | in-progress                                                              |
| **Owner**        | @hta218                                                                  |
| **Issue**        | [Weaverse/builder#2877](https://github.com/Weaverse/builder/issues/2877) |
| **Pull Request** | [#524](https://github.com/Weaverse/weaverse/pull/524)                    |
| **Branch**       | `feat/media-manager-exclude-config`                                      |
| **Base**         | `main` at `0d9711398988adb7de2c9fd3cc86810ebb8b4c04`                     |
| **Created**      | 2026-08-27                                                               |
| **Last Updated** | 2026-09-10                                                               |

## Initiating Requirement

> Add developer-declared Media Manager exclusion configuration to the SDK, replacing the merchant-editable project-level filter that [Weaverse/weaverse#519](https://github.com/Weaverse/weaverse/discussions/519) reported as insufficient: one project-wide rule cannot differ per picker, a content editor can disable it, and it cannot hide product media. Declare store-wide defaults through a new top-level `media` key on `HydrogenThemeSchema`, a sibling of `info` and `i18n` rather than an entry inside `settings`, because `settings` is `InspectorGroup[]` and renders as merchant-editable controls in Studio. Accept the same shape in the `configs` of the `image` and `video` inputs in `@weaverse/schema`: `excludeFilenamePrefixes` as a string array and `excludeProductFiles` as a boolean. An input's value overrides the theme value per field — an omitted key inherits, an array replaces the theme list, and `[]` shows every file — so that declaring one field never resets the other. Provide no `allowOverride` flag; key presence is the signal. `excludeProductFiles` maps to Shopify's `used_in:product`, which matches usage rather than origin, so a file uploaded to Files and later attached to a product is also hidden. A theme that declares no `media` key applies no filtering, which is not an error. Studio resolves these values and applies them to the gallery query; the Studio half is tracked in [Weaverse/builder#2877](https://github.com/Weaverse/builder/issues/2877) and its per-input allow-list is out of scope.

## Scope Updates

### 2026-09-09

- Merge `main` into the branch to pick up `@weaverse/next` pinning `@weaverse/schema@0.14.0` and the theme-schema types widened to accept a `createSchema` result. Without both, the packed public API check fails: the generated runtime export report resolves `export * from '@weaverse/schema'` against the workspace package, while the check installs the pinned published version that does not carry the new symbol.
- Reduce the test suite to cases that exercise a real branch. `image` and `video` share one branch in `BasicInputSchema`, and cases asserting only zod's own optional and array behaviour were dropped.
- Keep the `excludeProductFiles` usage-not-origin note in the schema README and reduce the two type declarations to a one-line form.
- Keep `MediaInputConfigsSchema` out of the public API. Nothing imports it, `ConfigsPropsSchema` and the `BasicInputSchema` type switch reference it within `validation.ts`, and exporting it was the branch's only change to the runtime export surface of `@weaverse/hydrogen` and `@weaverse/next`. The `MediaInputConfigs` type stays exported for themes to annotate their configs.

### 2026-09-10

- Route the theme-level validation gap raised in review to Studio. Theme code reaches Studio through `loadThemeSettings`, which spreads the theme schema without validating it, so a malformed `media.excludeFilenamePrefixes` is not rejected at authoring time the way a malformed per-input `configs` now is. `@weaverse/hydrogen` pins a published `@weaverse/schema` that does not export the validator, so the guard belongs in Studio and is tracked on [Weaverse/builder#2881](https://github.com/Weaverse/builder/pull/2881).

## Summary

Adds developer-declared media filtering to the SDK: a `media` key on
`HydrogenThemeSchema` for store-wide defaults, and matching `configs` on the
`image` and `video` inputs that override the theme value per field. The Studio
side reads these and applies them to the Media Manager gallery query, replacing
the merchant-editable project-level filter.
