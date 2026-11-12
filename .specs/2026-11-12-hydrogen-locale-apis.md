# Move the SDK to the Hydrogen 2026.10.3 locale APIs

Issue: [#591](https://github.com/Weaverse/weaverse/issues/591)

## Outcome

`@shopify/hydrogen` 2026.10.3 deprecates `I18nConfig` and the storefront client's `i18n` in favor of `ShopifyLocale` / `ShopifyMatchedLocale` and `storefront.locale` (removed in Hydrogen's next major). The SDK no longer reads or exposes either deprecated API, so themes on the new `defineShopifyI18n` setup get no deprecation warnings from Weaverse.

## Scope & contract

- `WeaverseI18n` is based on `ShopifyLocale` instead of `I18nConfig`. The shape is unchanged: `{language, country}` plus optional `pathPrefix`, `label` and extra fields, so existing theme objects still type-check.
- `WeaverseClient` defaults its locale to `storefront.locale` instead of `storefront.i18n`. The explicit `locale` argument still wins.
- The Next adapter's structural `WeaverseNextStorefront` gains `locale`; `i18n` stays as a deprecated fallback because the adapter accepts non-Hydrogen clients. Page requests read `requestContext.i18n`, then `storefront.locale`, then `storefront.i18n`.
- The `@shopify/hydrogen` peer moves to `>=2026.10.3`, the first release with `storefront.locale`.
- Unchanged: the Weaverse wire format (`requestInfo.i18n`, `routeContext.i18n`, page-request `i18n`) that Studio and the API read.
- Ships in 6.3.0, together with [#592](https://github.com/Weaverse/weaverse/issues/592).

## Acceptance

- `pnpm run biome`, `typecheck` and `test` pass; `api:check` shows only the `WeaverseI18n` base type change and the added `WeaverseNextStorefront.locale`.

## Files

- `packages/hydrogen/package.json`, `pnpm-lock.yaml`
- `packages/hydrogen/src/types.ts`, `src/weaverse-client.ts`
- `packages/hydrogen/src/next/types.ts`, `src/next/server/server-client.ts`
- `packages/hydrogen/readme.md`
- `packages/hydrogen/__tests__/weaverse-client.test.ts`, `__tests__/load-failures.test.ts`, `__tests__/next/next-server.test.tsx`
- `api-reports/hydrogen*.api.md`
