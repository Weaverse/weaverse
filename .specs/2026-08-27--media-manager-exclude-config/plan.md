# Plan — Media Manager Exclude Config (SDK side)

## Problem

The Media Manager gallery lists every file from Shopify Admin → Content → Files.
Stores that upload generated assets programmatically (hundreds of `thumb_v*`
files) and stores with large catalogs (product media dominating the gallery) end
up with an unusable picker.

Raised in [Weaverse/weaverse#519](https://github.com/Weaverse/weaverse/discussions/519).
A merchant-editable, project-level filter shipped first; the reporter's feedback
was that rules belong in theme code, where a content editor cannot change them.

## Decision

Exclusion rules are declared by the developer, in two places:

1. `HydrogenThemeSchema.media` — store-wide default, top-level key.
2. `configs` on an `image` / `video` input — overrides the theme, per field.

Resolution, applied Studio-side:

```
prefixes     = input.excludeFilenamePrefixes ?? theme.excludeFilenamePrefixes ?? []
productFiles = input.excludeProductFiles     ?? theme.excludeProductFiles     ?? false
```

`undefined` inherits, an array replaces, `[]` deliberately shows every file.
There is no `allowOverride` flag — key presence is the signal.

`media` is a sibling of `settings`, never an entry inside it: `settings` is
`InspectorGroup[]` and renders as merchant-editable controls, which is exactly
what these rules must not be.

## Why the theme type is inline

`packages/hydrogen` depends on the published `@weaverse/schema@0.14.0`, not the
workspace copy (`node_modules/@weaverse/schema` is a registry install, not a
symlink). Importing `MediaInputConfigs` from `@weaverse/schema` in the same PR
that adds it would fail `pnpm run typecheck` until schema is published.

`HydrogenThemeSchema` already types `info` and `i18n` inline, so `media` is
typed inline too — consistent with the surrounding code and free of the
cross-package version coupling. The schema package keeps `MediaInputConfigs` as
the named type for the input side.

## Validation

`BasicInputSchema` now validates `configs` for `image` and `video` against
`MediaInputConfigsSchema`. Previously these fell through to `default: return`
(any structure allowed). This is deliberate: the source is now theme code with
no Studio UI to recover from a mistake, so a mistyped exclusion (a bare string
instead of an array) must surface at authoring time rather than silently
disabling filtering.

`z.object` is non-strict, so existing themes carrying unrelated keys in an
image/video `configs` still parse.

## Files touched

- `packages/schema/src/validation.ts` — `MediaInputConfigsSchema`,
  `MediaInputConfigs`, added to `ConfigsPropsSchema` / `ConfigsProps`, and the
  `image` / `video` cases in `BasicInputSchema`'s configs check
- `packages/schema/src/index.ts` — public exports for both symbols
- `packages/schema/test/media-input-configs.test.ts` — new
- `packages/schema/README.md` — media picker configuration section
- `packages/hydrogen/src/types.ts` — `media` key on `HydrogenThemeSchema`
- `api-reports/schema.api.md`, `api-reports/hydrogen.api.md`,
  `api-reports/runtime-exports.api.md` — regenerated via `pnpm run api:report`

## Out of scope

- Studio-side resolution, query building, and removal of the project-level
  filter — tracked in Weaverse/builder#2877.
- Per-input allow-list (show only files matching a prefix). No use case raised;
  `excludeFilenamePrefixes: []` already covers "this picker shows everything".
