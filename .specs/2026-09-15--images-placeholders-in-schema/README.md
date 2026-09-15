# Feature: Share `IMAGES_PLACEHOLDERS` from `@weaverse/schema`

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **Status**       | in-progress                                            |
| **Owner**        | @hta218                                                |
| **Issue**        | N/A                                                    |
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
