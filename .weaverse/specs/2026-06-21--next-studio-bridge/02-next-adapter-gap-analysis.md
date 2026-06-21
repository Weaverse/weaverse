# 02 — Current `@weaverse/next` gap analysis

## Current package strengths

The current alpha package already provides a solid render runtime:

- Component registration.
- Default `main` root support.
- Flat Weaverse page-tree rendering through `WeaverseRoot`.
- Provider context for page/root/theme/commerce data.
- Request-safe component loader runner.
- `commerce.storefront` and `weaverse.storefront` compatibility aliases.
- Theme schema default merge for static rendering.
- Tests covering render/provider/loader basics.

## Current limitation

The package is render-only for Studio purposes. It creates a base `Weaverse` runtime and renders DOM markers, but it does not implement Studio lifecycle or runtime compatibility.

Observed POC state:

- Page visually renders in a Next iframe/route.
- `.weaverse-content-root` and `data-wv-*` markers can exist.
- No Studio script is loaded.
- `window.weaverseStudio` is absent.
- POC uses a hardcoded project id (`poc-test`) instead of the real runtime project id.

## SDK gaps

### P0 gaps

1. **No root-level Studio script connection**
   - Needed so Studio/design-mode pages can establish a bridge before page content is ready.

2. **No page-level runtime bind**
   - Needed to call `window.weaverseStudio.init(runtime)` once a valid runtime exists.

3. **No design-mode refresh loop**
   - Needed to call `window.weaverseStudio.refreshStudio(params)` when a runtime is reused with updated page/request data.

4. **Runtime shape too thin**
   - Base `Weaverse` does not expose the Next Studio runtime contract: `pageId`, `requestInfo`, `internal.navigate`, `internal.revalidate`, `internal.themeSettingsStore`, `internal.pageAssignment`, and related metadata.

5. **Theme store contract incomplete**
   - The bridge-compatible method is `updateThemeSettings`; a different setter name is insufficient.

6. **Design-mode cache policy missing**
   - POC/page fetches must bypass stale cache in design mode.

7. **Project/runtime metadata mismatch**
   - POC hardcodes `projectId: 'poc-test'`; Studio needs the real project id and page/runtime metadata.

### P1 gaps

1. **Next revalidation strategy is underspecified**
   - `router.refresh()` is necessary but not automatically equivalent to Hydrogen's loader revalidation semantics.
   - The SDK/app must define how draft item context reaches the server fetch path for loader-backed updates.

2. **Component schema shape parity**
   - Studio must inspect schema settings/inputs/visibility. Schema presence alone is not enough; shape compatibility needs tests.

3. **Iframe embeddability**
   - The storefront preview must allow Studio framing through appropriate headers/CSP.

4. **Global runtime identity**
   - The adapter must document and test runtime reuse vs recreation across path/search/page changes.

### P2 gaps

1. **Translation/static text parity**
   - v0 may degrade gracefully, but the unsupported behavior must be explicit.

2. **Multi-page/nested runtime parity**
   - Multiple Weaverse instances on one route should be a later hardening target.

3. **404/error-route connection parity**
   - Root-level connect should eventually avoid false Studio timeouts on routes without Weaverse content.

## Conclusion

`@weaverse/next` should not claim Studio support through DOM rendering alone. Studio support needs a deliberate runtime compatibility layer plus direct design-mode and actual Studio smoke verification.
