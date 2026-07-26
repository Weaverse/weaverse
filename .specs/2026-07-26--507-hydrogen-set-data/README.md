# Feature: Hydrogen item data refresh on reused item stores

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Status**       | completed                                                        |
| **Owner**        | @hta218                                                          |
| **Issue**        | [#507](https://github.com/Weaverse/weaverse/issues/507)          |
| **Branch**       | `fix/507-hydrogen-set-data`                                      |
| **Created**      | 2026-07-26                                                       |
| **Last Updated** | 2026-07-26                                                       |

## Original Prompt

> Fix @weaverse/hydrogen item-store updates so reused items flatten fresh serialized settings, reset omitted default-valued fields from the schema, and preserve settings for empty context-only setData({}) refreshes.

## Summary

`WeaverseHydrogenItem`'s constructor flattens serialized `item.data` (plus schema
defaults) onto the top-level `_store`, but the inherited `WeaverseItemStore.setData`
performs a raw shallow merge. On client-side navigations that reuse item stores
(same item ids across locales), fresh settings land under `_store.data` while the
stale flattened values keep rendering. This spec overrides `setData` in the
Hydrogen item store so reused items flatten fresh settings, reset fields the
payload omits because they equal a schema default, and still support the
context-only `setData({})` refresh without wiping settings.
