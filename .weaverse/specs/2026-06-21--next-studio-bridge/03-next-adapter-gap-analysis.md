# 03 — Current `@weaverse/next` gap analysis

This document compares the current `@weaverse/next` alpha with the Builder/Hydrogen Studio Bridge contract.

## Current package state

Key files:

```text
packages/next/src/index.ts
packages/next/src/types.ts
packages/next/src/client.ts
packages/next/src/provider.tsx
packages/next/src/renderer.tsx
packages/next/src/loader.ts
packages/next/src/registry.ts
packages/next/src/main.tsx
packages/next/src/hooks.ts
packages/next/__tests__/next-adapter.test.tsx
```

Current public shape:

```ts
createWeaverseNextClient(config)
runWeaverseComponentLoaders(args)
WeaverseNextProvider
WeaverseNextRenderer
useThemeSettings()
useWeaverseCommerce()
useWeaversePageData()
useWeaverseRootData()
```

Current proven strengths:

- Component registration exists.
- Default `main` component support exists.
- Flat Weaverse page tree can render.
- Provider can supply explicit root/page/commerce data.
- Component loaders can run request-safely and clone input data.
- `commerce.storefront` and `weaverse.storefront` compatibility alias exist.
- Theme schema defaults merge under explicit theme settings.
- Tests cover render/provider/loader basics.

## Current renderer shape

`WeaverseNextRenderer` currently creates a bare framework-neutral instance:

```ts
let instance = new Weaverse({
  projectId: client?.projectId || page.id || 'weaverse-next',
  data: page,
})
instance.dataContext = dataContext
instance.isDesignMode = client?.requestContext?.isDesignMode ?? false
return <WeaverseRoot context={instance} />
```

This is enough for rendering. It is not enough for Studio.

## Direct POC evidence

A direct design-mode URL was loaded with Studio query params. Observed from browser console:

```js
{
  hasRoot: true,
  hasStudio: false,
  itemCount: 20,
  scripts: [/* only Next chunks, no /static/studio script */]
}
```

Meaning:

- The Next POC renders real content.
- The page has a Weaverse root.
- The Studio bridge script is not loaded.
- `window.weaverseStudio` is missing.
- Builder cannot establish RPC handshake.

This confirms the current POC is render-only, not Studio-connected.

## POC-specific issue: hardcoded project id

Current POC wrapper creates the client with:

```ts
createWeaverseNextClient({
  projectId: 'poc-test',
  components,
})
```

This causes `data-weaverse-project-id="poc-test"` in the DOM even when page data came from a real Weaverse project.

This must be fixed during POC Studio work by passing the real project id/configs from fetched data or environment. Do not commit secret env values; only pass the resolved public project id/runtime config.

## Gaps against Builder/Hydrogen contract

### 1. No bridge script loader

Missing equivalent of Hydrogen:

```text
useStudioConnect()
getStudioScriptSrc()
resolveStudioScriptSrc()
loadScript(src)
```

Impact:

- No `/static/studio/hydrogen/index.js` request.
- No `window.weaverseStudio`.
- No preview-side RPC endpoint.
- Builder times out or reports connection lost.

### 2. No page-level `studio.init(weaverse)` binding

Missing equivalent of Hydrogen:

```text
useStudio(weaverse)
  -> load script
  -> wait for window.weaverseStudio
  -> window.weaverseStudio.init(weaverse)
```

Impact:

- Even if a script were manually injected, the bridge would not have a runtime instance.
- No `syncPreviewData()`.
- No outline/schema/theme sync.
- No `setStudioStateReady()`.

### 3. Runtime instance is too thin

Bare `Weaverse` lacks these fields expected by Builder bridge:

```text
pageId
requestInfo
internal.project
internal.pageAssignment
internal.navigate
internal.revalidate
internal.themeSettingsStore
weaverseHost
weaverseApiBase
weaverseApiKey
weaverseVersion
isPreviewMode
isRevisionPreview
sectionType
translationMap/translationLocale/translationLanguageId
```

Impact:

- `studio.init()` cannot sync correct metadata.
- `navigate`, `refreshPage`, `previewTemplate`, and `revalidate` cannot work.
- Theme settings inspector cannot read/update settings.
- Translation/static text workflows cannot work.

### 4. No Next navigation/revalidation adapter

Builder bridge uses Hydrogen's React Router callbacks:

```text
navigate(to)
revalidate()
```

Next equivalent must be provided via:

```text
router.push(to, { scroll: false })
router.refresh()
```

or framework-agnostic callbacks passed by the app.

Impact:

- Studio-driven navigation and refresh cannot work.
- Item loader revalidation path cannot work.

### 5. Theme settings are only React-context readable

Current `useThemeSettings()` returns context value:

```ts
useWeaverseNextContext('useThemeSettings').themeSettings
```

Bridge expects:

```ts
weaverse.internal.themeSettingsStore.schema
weaverse.internal.themeSettingsStore.settings
weaverse.internal.themeSettingsStore.publicEnv
```

Impact:

- Editor `syncPreviewData()` cannot include full theme config/publicEnv through existing bridge paths.
- `PreviewRPC.call.getThemeSettings()` cannot return the expected data.
- Theme settings inspector/update flow is blocked.

### 6. Component schema serialization is incomplete for Studio

Runtime render only needs registered components. Studio also needs schemas with condition functions serialized/migrated enough for inspector visibility.

Hydrogen has:

```text
getAllComponentSchemas(...)
migrateSchema(...)
addInputsVisibilityToSchema(...)
```

Next must either reuse the same Builder bridge expectations or provide equivalent compatible schemas through the runtime instance.

### 7. Request info is incomplete

Current `WeaverseNextRequestContext` supports:

```ts
pathname?
searchParams?
url?
i18n?
isDesignMode?
isPreviewMode?
isRevisionPreview?
sectionType?
```

But renderer currently only uses `isDesignMode`. It does not propagate a full Hydrogen-like `requestInfo` to the runtime instance.

Impact:

- Editor preview path sync can be wrong.
- `resolveEditingInstance()` cannot distinguish same URL/multiple page cases correctly.
- Locale/translation context cannot sync.

### 8. No root-level connect for non-content routes

Hydrogen deliberately mounts `StudioConnect` at root layout level. Current Next package only renders Studio-related runtime where `WeaverseNextRenderer` is mounted.

Impact:

- Studio can report false connection lost on routes where page content does not render.
- 404/error route behavior is worse than Hydrogen.

### 9. Translation sidecar/static text are not addressed

Hydrogen supports:

```text
translationMap
translationLocale
translationLanguageId
setTranslationSidecar()
getTranslationChanges()
ThemeTextStore/static text drafts
```

Current `@weaverse/next` does not.

Impact:

- Translation UI likely cannot work in Next Studio initially.
- Static text edits may not persist across iframe refresh.

This may be a v0 limitation, but the runtime should fail gracefully and document unsupported features if not implemented in the first slice.

## Risk: importing `next/navigation` from the package

If `@weaverse/next` imports `next/navigation`, the package likely needs `next` as a peer dependency.

Tradeoffs:

| Option | Pros | Cons |
| --- | --- | --- |
| Package imports `useRouter` directly | Easier consumer API | Adds Next peer/import; harder to test outside Next |
| Consumer passes `navigate`/`refresh` callbacks | Keeps package lighter/testable | More boilerplate; easy to misconfigure |
| Export `next/navigation` subpath only | Main package stays generic | More API surface |

Recommended for v0 Studio slice:

- Keep core runtime free of direct Next imports where possible.
- Provide a thin client component/hook in `@weaverse/next/studio` or main export that uses `next/navigation` if acceptable.
- Treat `next` as a peer dependency if direct import is used.

## Risk: reusing `/static/studio/hydrogen/index.js`

Pros:

- Fastest path.
- No Builder deployment/change required if existing script is compatible.
- Existing bridge already handles schemas, outline, selection, edits, revalidation, translation paths.

Cons:

- File/path name is Hydrogen-specific.
- Bridge imports types from `@weaverse/hydrogen` in Builder source.
- Some runtime assumptions may be deeper than structural.

Recommendation:

- Reuse first with a compatible runtime object.
- Only split Builder bridge after finding concrete runtime incompatibilities.

## Gap priority

| Priority | Gap | Reason |
| --- | --- | --- |
| P0 | Script loading + `window.weaverseStudio` | Without this no RPC exists |
| P0 | `studio.init(runtime)` | Without this no page binding/sync |
| P0 | Runtime shape: `pageId`, `requestInfo`, `internal.*` | Required by `init()` and edit methods |
| P0 | Real project id/config in POC | Basic correctness for Studio project binding |
| P1 | Theme settings store compatibility | Inspector/theme sync |
| P1 | Navigate/revalidate adapter | Studio navigation/edit refresh |
| P1 | Component schema availability | Outline/inspector/add-item |
| P2 | Translation/static text sidecar | Important parity, may be after first connection smoke |
| P2 | Root-level non-content connect | Prevent false timeout on 404/error routes |

## Conclusion

The current `@weaverse/next` renderer is a good render-runtime v0. It should not be stretched by small patches to pretend Studio works. Studio support needs a deliberate runtime compatibility layer that mirrors Hydrogen's two-part design:

```text
root-level connect + page-level bind
```

and a runtime instance that satisfies the existing Builder bridge contract.
