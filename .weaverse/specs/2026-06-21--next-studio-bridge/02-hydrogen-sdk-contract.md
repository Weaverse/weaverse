# 02 — Hydrogen SDK runtime contract

This document describes why Studio works for Hydrogen today and what `@weaverse/next` must emulate or generalize.

## Key SDK files

```text
packages/hydrogen/src/WeaverseHydrogenRoot.tsx
packages/hydrogen/src/utils/use-studio.ts
packages/hydrogen/src/utils/studio-script-src.ts
packages/hydrogen/src/utils/index.ts
packages/hydrogen/src/weaverse-client.ts
packages/hydrogen/src/types.ts
packages/react/src/renderer.tsx
packages/core/src/core.ts
```

## Existing Hydrogen public/runtime pieces

| Piece | File | Responsibility |
| --- | --- | --- |
| `WeaverseClient` | `weaverse-client.ts` | Server-side request/config/page/theme loader |
| `WeaverseHydrogenRoot` | `WeaverseHydrogenRoot.tsx` | Client renderer + runtime instance creation |
| `WeaverseHydrogen` | `WeaverseHydrogenRoot.tsx` | Runtime class extending `Weaverse` with Studio fields |
| `WeaverseHydrogenItem` | `WeaverseHydrogenRoot.tsx` | Item store with schema defaults + translation snapshots |
| `withWeaverse()` | `WeaverseHydrogenRoot.tsx` | Root layout wrapper; mounts root Studio connect and providers |
| `useStudioConnect()` | `utils/use-studio.ts` | Root-level bridge script load, even on content-less/error routes |
| `useStudio(weaverse)` | `utils/use-studio.ts` | Page-level bridge bind/init |
| `getStudioScriptSrc()` | `utils/studio-script-src.ts` | Convert mode/config into bridge script URL |
| `resolveStudioScriptSrc()` | `utils/studio-script-src.ts` | Trusted query-based script resolution |

## Server-side data contract from `WeaverseClient.loadPage()`

Hydrogen `loadPage()` returns data close to:

```ts
{
  page,
  project,
  pageAssignment,
  configs: {
    projectId,
    weaverseHost,
    weaverseApiBase,
    weaverseApiKey,
    weaverseVersion,
    isDesignMode,
    isPreviewMode,
    isRevisionPreview,
    requestInfo: {
      i18n: storefront.i18n,
      queries: getRequestQueries(request),
      pathname: parsedUrl.pathname,
      search: parsedUrl.search,
    },
  },
}
```

Important behavior:

- Design/revision modes bypass shared stale cache.
- The public API request uses `normalizePageUrl(request.url)`.
- Component loaders run server-side and attach `loaderData`.
- Empty/missing pages get a fallback `main` page.
- `configs.requestInfo` is later used by Studio sync and routing logic.

## Theme settings contract from `loadThemeSettings()`

Hydrogen `loadThemeSettings()` returns:

```ts
{
  theme,
  schema?,
  publicEnv?,
  staticContent?,
  merchantOverrides?,
}
```

Important behavior:

- Theme schema defaults are merged under merchant overrides.
- In design mode, schema is serialized with function conditions converted to strings.
- `publicEnv` is included for editor usage.
- Merchant/static translation overrides are included but must not include server secrets.

## `withWeaverse()` root-level contract

Hydrogen requires the root route `Layout` to be wrapped:

```tsx
export const Layout = withWeaverse(RootLayout)
```

Why root `Layout`, not only route component:

- React Router root layout wraps route error boundaries.
- Studio must still answer the handshake on 404s/error routes.
- A page-scoped bridge does not mount on content-less routes.

`withWeaverse()` mounts:

```text
ThemeSettingsStoreContext.Provider
  -> TranslationProvider
    -> <StudioConnect />
    -> <App />
```

For Next, this means a root/layout-level client component is still needed if we want Studio to avoid false connection timeouts on non-Weaverse routes.

## `useStudioConnect()` root bridge script load

File:

```text
packages/hydrogen/src/utils/use-studio.ts
```

Behavior:

```text
read current URL search
  -> resolveStudioScriptSrc(search, document.hostname)
  -> loadScript(src) if trusted and in design/preview/revision mode
```

It intentionally does **not** require page data.

This solves:

- 404 route iframe loaded in Studio.
- Error boundary replacing page content.
- Route where `WeaverseHydrogenRoot` is not mounted.
- Early handshake before page data resolves.

## `useStudio(weaverse)` page-level bind

File:

```text
packages/hydrogen/src/utils/use-studio.ts
```

Behavior:

```text
if design mode:
  set weaverse.internal.navigate
  set weaverse.internal.revalidate
  set weaverse.internal.themeSettingsStore
  set translation/static text stores
  load Studio bridge script
  wait for window.weaverseStudio
  call window.weaverseStudio.init(weaverse)

if preview/revision mode:
  only load preview bridge script
```

This is the missing piece in `@weaverse/next` today.

## Studio script URL contract

File:

```text
packages/hydrogen/src/utils/studio-script-src.ts
```

Current script paths:

```text
Design mode:
  ${weaverseHost}/static/studio/hydrogen/index.js?v=${weaverseVersion}

Preview/revision mode:
  ${weaverseHost}/static/studio/hydrogen/preview.js?v=${weaverseVersion}
```

Security behavior:

- Query-supplied `weaverseHost` is attacker-controllable.
- Only trusted Weaverse origins are accepted by default.
- Loopback Studio hosts are allowed only when the storefront itself is loopback.
- Untrusted host returns `null`, not fallback-to-production.

Next should reuse this policy, not invent a looser one.

## Runtime class: `WeaverseHydrogen`

Hydrogen extends framework-neutral `Weaverse` with Studio-specific fields:

```ts
class WeaverseHydrogen extends Weaverse {
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  projectId: string
  weaverseHost: string
  weaverseApiBase: string
  weaverseApiKey: string
  weaverseVersion: string
  isDesignMode: boolean
  isPreviewMode: boolean
  isRevisionPreview: boolean
  sectionType: string
  data: HydrogenPageData
  translationMap: TranslationMap
  translationLocale: string
  translationLanguageId: string
}
```

It also has methods used by the bridge:

```ts
extractTranslationSidecar()
setTranslationSidecar(map, locale, languageId)
updateTranslation(itemId, key, originalValue, translatedValue)
getTranslationChanges()
setProjectData(data)
refreshAllItems()
triggerUpdate()
```

## Runtime instance reuse and global registry

Hydrogen stores instances in:

```ts
window.__weaverses[pageId] = weaverse
```

The bridge uses this for:

- nested layout + child page disambiguation,
- `getPagesData()` save payload across multiple page instances,
- rebind after page selector navigation,
- resolving the intended page via `getEditingPageId()`.

Next support should preserve this shape if reusing the current Builder bridge.

## Item class: `WeaverseHydrogenItem`

Hydrogen item store extends `WeaverseItemStore` and adds:

- schema default merge into `_store`,
- translation-aware `getSnapShot()` with memoized merged values,
- cache invalidation when translation sidecar changes.

Constructor behavior:

```text
initialData.data + schema defaults + rest fields -> flat item store
```

This matters because Builder `generatePageData()` and inspector logic expect item data at the top level of `_store`, while persisted save data nests changed values back into `data`.

## Renderer contract from `@weaverse/react`

File:

```text
packages/react/src/renderer.tsx
```

`WeaverseRoot` renders:

```tsx
<div className="weaverse-content-root"
     data-weaverse-project-id={context.projectId}
     data-weaverse-template-id={data.id}>
  <ItemInstance id={getRootId(context)} />
</div>
```

`ItemComponent` passes to registered section components:

```tsx
<Component
  {...processedRest}
  children={renderChildren || undefined}
  className={clsx(processedRest.data?.className)}
  data-wv-id={id}
  data-wv-type={type}
  ref={instance.ref}
/>
```

Therefore registered components must forward unknown props to their DOM root.

## Theme settings store contract

Bridge code expects:

```ts
weaverse.internal.themeSettingsStore.schema
weaverse.internal.themeSettingsStore.settings
weaverse.internal.themeSettingsStore.publicEnv
weaverse.internal.themeSettingsStore.subscribe(...)
weaverse.internal.themeSettingsStore.getSnapshot()
```

Hydrogen gets this from `useThemeSettingsStore()`.

The current `@weaverse/next` only exposes theme settings through React context/hook. That is not enough for the Builder bridge because the bridge reads from `weaverse.internal.themeSettingsStore` directly.

## Navigation/revalidation contract

Hydrogen provides:

```ts
weaverse.internal.navigate = useNavigate()
weaverse.internal.revalidate = useRevalidator().revalidate
```

Builder bridge uses these for:

- `navigate(to)`
- `refreshPage()`
- `previewTemplate(url, templateId)`
- `revalidate(id?)`
- post-edit loader refresh

Next mapping options:

| Hydrogen | Next equivalent |
| --- | --- |
| `navigate(to, { preventScrollReset: true })` | `router.push(to, { scroll: false })` |
| `revalidate()` | `router.refresh()` |
| cache-buster query route refresh | preserve via query param + `router.push()` |

## Key Hydrogen behavior to preserve

- Root-level bridge script load must not depend on page content.
- Page-level `studio.init(weaverse)` must happen only after a valid runtime instance exists.
- Design mode must bypass stale cache.
- The runtime instance must be reused/refreshed carefully to preserve item subscriptions.
- Theme schema and component schemas must be available to Builder.
- Server-only values must never be serialized into client payload.

## Implication for `@weaverse/next`

`@weaverse/next` should not only expose a renderer. It needs a design-mode runtime layer with:

```text
WeaverseNextRuntime extends/adapts Weaverse
WeaverseNextItem extends WeaverseItemStore
NextStudioConnect root hook/component
NextStudioBridge page bind hook/component
Next theme settings store compatibility
Next requestInfo/query extraction
Next navigation/revalidation adapters
```

This can be implemented behind a small public API without forcing every consumer to understand the bridge internals.
