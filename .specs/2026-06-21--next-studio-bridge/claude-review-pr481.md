## Verdict
**APPROVE**

## Blocking findings
None.

## Non-blocking findings

1. **Silent partial-pagination truncation has no signal to caller** (`packages/next/src/server/server-client.ts:256-298`, `fetchCustomPages`). On a mid-pagination fetch failure or hitting `MAX_CUSTOM_PAGE_PAGES`, the function returns whatever was accumulated so far with only a `console.warn` — the return type gives callers no way to distinguish a complete sitemap from a truncated one. This is intentional 1:1 parity with `packages/hydrogen/src/weaverse-client.ts:857-913` (`fetchCustomPages`), so it's not a regression introduced here, just a pre-existing tradeoff worth a follow-up (e.g. optional `onError`/`meta.truncated` flag) if sitemap completeness ever becomes a real incident.

2. **`WeaverseNextCustomPageEntry.locale` typed as required `string | null`** (`packages/next/src/types.ts` new `WeaverseNextCustomPageEntry`), but nothing guarantees the backend always sends the key — if omitted, `locale` would be `undefined` at runtime while the type says `string | null`. Purely a type-precision nit; doesn't affect the tested paths.

3. **`getWeaverseNextSeoMetadata`/`formatWeaverseNextSeoMetadata` are exported from both the root `@weaverse/next` entry and `@weaverse/next/server`** (`packages/next/src/index.ts` and `packages/next/src/server.ts`). Confirmed intentional and safe since `seo.ts` has no `next/*`/`react` imports, but worth a one-line README note (currently only documented under `/server`) so consumers know the root import also works.

## Verification notes
- Cross-checked `formatWeaverseNextSeoMetadata`'s field mapping against the authoritative `PageSEOData` shape in `packages/schema/src/page-seo.ts` — field names (`canonicalUrl`, `openGraph.{title,description,image,type}`, `twitter.{cardType,title,description,image}`, `robots.{index,follow}`) match exactly; no drift.
- Verified `getWeaverseNextSeoMetadata`'s structural narrowing (`'items' in data && 'id' in data`) is sound: `WeaverseNextPageData` requires both `id`/`items`, while `WeaverseNextLoaderData` only guarantees `page` — no ambiguous overlap in the declared types (`packages/next/src/types.ts:119-139`).
- Verified `fetchCustomPages`/`_buildCustomPagesUrl` endpoint path, query params, cache-knob wiring (`revalidate`/`tags` → `fetchWithCache`), pagination cap, and partial-failure behavior are a faithful port of `packages/hydrogen/src/weaverse-client.ts:861-913`, including the `cache: 'no-store'` override in design/revision-preview mode inherited from the shared `fetchWithCache` (`packages/next/src/server/server-client.ts:189-227`).
- `resolveProjectId()` never throws (internal try/catch), so the `if (!projectId)` guard in `fetchCustomPages` correctly handles the unresolved-project case without needing its own try/catch.
- Resource-picker aliases (`WeaverseBlog`, `WeaverseArticle`, `WeaverseMetaObject`) are trivial type aliases to `WeaverseResourcePickerData`, matching the existing `WeaverseProduct`/`WeaverseCollection` pattern — no runtime surface, low risk.
- Did not re-run the test/typecheck/build/biome/CI commands myself; relying on Hermes's verification results as reported (all pass) since the diff review didn't surface anything that would contradict them.

## Follow-up slices
- Confirmed the PR stays within the stated scope (custom-pages sitemap helper, SEO metadata helpers, resource-picker aliases, README/work-log updates). No translation/global-section/multi-runtime work was introduced, consistent with the Weaverse/builder#2659 slicing plan — nothing to flag as out-of-scope.
- Possible future hardening (non-blocking, not for this PR): surface partial-pagination truncation to callers (see finding 1) if it turns out sitemaps silently losing tail pages becomes an operational issue.
