# Feature: Theme route patterns

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | in-progress                                              |
| **Owner**        | @hta218                                                  |
| **Issue**        | [#518](https://github.com/Weaverse/weaverse/issues/518)  |
| **Branch**       | `feat/theme-route-patterns`                              |
| **Created**      | 2026-10-07                                               |
| **Last Updated** | 2026-10-07                                               |

## Original Prompt

> Studio resolves a page's preview URL from a hardcoded Shopify route convention (`getDefaultPagePrefix` in Builder: `products`, `collections`, `pages`, `blogs`). A theme that routes differently cannot be navigated from the Studio page selector.
>
> Forward is the first such theme: it uses `/shop/:handle` for collections and `/journal/:handle` for articles. Navigating from inside the preview works; picking the same page from the selector does not.
>
> ## Proposal
>
> Let the theme schema carry its own route map, since the theme is the only thing that knows its routes. Studio uses it when present and falls back to today's Shopify convention when absent, so Hydrogen themes are unaffected.
>
> ```ts
> export const themeSchema = {
>   info: { name: 'Forward' },
>   routes: {
>     PRODUCT: '/products/:handle',
>     COLLECTION: '/shop/:handle',
>     PAGE: '/pages/:handle',
>     ARTICLE: '/journal/:handle',
>   },
>   settings: [...],
> }
> ```
>
> ## Patterns, not prefixes
>
> A plain prefix string is not enough. Shopify addresses an article as `/blogs/:blog/:article` — two segments — and Forward as `/journal/:article` — one. A prefix can express `journal` but cannot drop the blog segment, so the shape has to be a pattern.
>
> ## Related
>
> `Page.prefix` already exists in Builder and most of Studio honours it (`url-picker/*`, `store-url-search`), but it is per-page manual data and carries the same prefix-vs-pattern limitation. A theme-declared map is what makes a starter work on clone without per-page setup.
>
> Needs a matching change in Builder to consume the map.

Decisions on the open questions (2026-10-07): the key set is Weaverse's page types (minus `*` and `CUSTOM`); a partial map falls back per missing key; the grammar is static segments plus `:param` only.

## Summary

A theme declares `routes` in its theme schema, keyed by page type, so Studio navigates to pages on a theme that does not follow the Shopify URL convention (Forward: `/shop/:handle`, `/journal/:handle`). The SDK owns the contract (`ThemeRoutes`); the Builder resolves it; the theme declares it.
