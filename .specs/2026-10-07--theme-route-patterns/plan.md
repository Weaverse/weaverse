# Plan: Theme route patterns

## Contract (`@weaverse/schema`)

- `ThemeRoutePageType = Exclude<PageType, '*' | 'CUSTOM'>`.
- `ThemeRoutes = Partial<Record<ThemeRoutePageType, string>>`.
- A pattern is an absolute path of static segments and whole `:param` segments. Two params:
  - `:handle`: the page's own handle (product, collection, page, blog or article).
  - `:blog`: an article's blog handle; `ARTICLE` only.
- A missing key, or a pattern the consumer cannot fill, falls back to the Shopify convention.

Types only. Resolution lives in its one consumer, the Builder; a resolver in the SDK would have no other caller and could not reach the Builder until a release anyway.

## Follow-up, after `@weaverse/schema` is released

`routes?: ThemeRoutes` on `HydrogenThemeSchema` and `WeaverseNextThemeSchema`. Internal deps resolve from npm, so these cannot compile against an unpublished export. Not blocking: both schemas already accept extra keys and `loadThemeSettings` sends the whole schema to Studio in design mode, so a theme can declare `routes` today.

## Other repos

- **Builder:** turn `getDefaultPagePrefix` call sites into a path builder that prefers the theme's pattern from `useThemeConfigStore` (Studio only).
- **Forward:** declare `ALL_PRODUCTS`, `COLLECTION` and `ARTICLE` routes.

## Files touched

| File | Change |
| --- | --- |
| `packages/schema/src/theme-routes.ts` | `ThemeRoutePageType`, `ThemeRoutes`, param contract |
| `packages/schema/src/index.ts` | Type exports |
| `packages/schema/test/theme-routes.test.ts` | Type test |
| `api-reports/schema.api.md` | API report |
| `.specs/2026-10-07--theme-route-patterns/` | This spec |
