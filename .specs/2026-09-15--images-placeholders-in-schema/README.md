# Feature: Share `IMAGES_PLACEHOLDERS` from `@weaverse/schema`

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **Status**       | completed                                              |
| **Owner**        | @hta218                                                |
| **Issue**        | N/A                                                    |
| **Pull Request** | [#527](https://github.com/Weaverse/weaverse/pull/527)  |
| **Branch**       | `update/move-images-placeholders-to-schema`            |
| **Base**         | `main` at `a509c37cae680a68dba123e3bb22442b05da1ec0`   |
| **Created**      | 2026-09-15                                             |
| **Last Updated** | 2026-09-15                                             |

## Initiating Requirement

> `@weaverse/next` does not export `IMAGES_PLACEHOLDERS`, which `@weaverse/hydrogen` defines and exports from `packages/hydrogen/src/index.ts`. Move the constant into a shared package so both storefront adapters expose it, and remove the definition from `@weaverse/hydrogen`. The shared home is `@weaverse/schema`: both `@weaverse/hydrogen` and `@weaverse/next` already `export * from '@weaverse/schema'`, the constant exists to supply component schema defaults and theme previews, and the package has no internal dependencies. `@weaverse/core` and `@weaverse/react` were rejected because the constant is unrelated to the runtime engine or React rendering, and both adapters only re-export selected `@weaverse/react` symbols. Leave the change ready to publish. The existing import `import { IMAGES_PLACEHOLDERS } from '@weaverse/hydrogen'` must keep working.

## Summary

`IMAGES_PLACEHOLDERS` moves from `@weaverse/hydrogen` into `@weaverse/schema`, so
both `@weaverse/hydrogen` and `@weaverse/next` expose it through their existing
`export * from '@weaverse/schema'`. The values and member docs are unchanged.

## Outcome

Released in the order required by `plan.md`:

- `@weaverse/schema@0.16.0` exports `IMAGES_PLACEHOLDERS`.
- `@weaverse/core`, `@weaverse/react`, `@weaverse/hydrogen` `5.21.1`; `@weaverse/hydrogen` pins `@weaverse/schema@0.16.0`.
- `@weaverse/next@0.1.0-alpha.18` pins `@weaverse/schema@0.16.0`, published under `alpha` and `latest`.

The `Public package API` CI job failed on the `v5.21.1` release commit because `@weaverse/next` still pinned `@weaverse/schema@0.15.0`, which lacks the constant. The `@weaverse/next@0.1.0-alpha.18` release commit re-pinned it and CI passed.
