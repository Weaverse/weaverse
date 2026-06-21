# 04 — Proposed `@weaverse/next` Studio architecture

This document proposes the implementation architecture for Studio support in `@weaverse/next`.

## Architecture principle

Do not make Studio support a side effect of rendering only.

Use the same conceptual split as Hydrogen:

```text
Root-level connect
  -> load/answer bridge script even before page content exists

Page-level bind
  -> attach a concrete Weaverse runtime instance to the bridge
```

## Proposed package additions

Possible files:

```text
packages/next/src/studio-script-src.ts
packages/next/src/studio-connect.tsx
packages/next/src/studio-bridge.tsx
packages/next/src/runtime.ts
packages/next/src/item.ts
packages/next/src/theme-settings-store.ts
packages/next/src/request-info.ts
```

Potential public exports:

```ts
export {
  WeaverseNextStudioConnect,
  WeaverseNextStudioProvider,
  createWeaverseNextRuntime,
}

export type {
  WeaverseNextRuntime,
  WeaverseNextRuntimeConfig,
  WeaverseNextThemeSettingsStore,
}
```

Naming is provisional. The important contract is the split and runtime shape.

## Proposed runtime classes

### `WeaverseNextRuntime`

Extends or adapts `Weaverse`:

```ts
class WeaverseNextRuntime extends Weaverse {
  pageId: string
  internal: Partial<WeaverseNextInternal>
  requestInfo: WeaverseNextRequestInfo
  projectId: string
  weaverseHost: string
  weaverseApiBase: string
  weaverseApiKey: string
  weaverseVersion: string
  isDesignMode: boolean
  isPreviewMode: boolean
  isRevisionPreview: boolean
  sectionType: string
  data: WeaverseNextPageData
  dataContext: Record<string, unknown> | null

  translationMap: TranslationMapLike
  translationLocale: string
  translationLanguageId: string

  extractTranslationSidecar(): void
  setTranslationSidecar(map, locale, languageId): void
  updateTranslation(itemId, key, originalValue, translatedValue): void
  getTranslationChanges(): TranslationChanges | undefined
  setProjectData(data): void
}
```

The first implementation may stub translation methods if translation UI is out of scope, but it should keep method presence and no-op/fallback behavior explicit to avoid bridge crashes.

### `WeaverseNextItem`

Extends `WeaverseItemStore`:

```ts
class WeaverseNextItem extends WeaverseItemStore {
  declare weaverse: WeaverseNextRuntime
  get Element(): WeaverseElement
  getSnapShot(): ElementData
}
```

Requirements:

- Register item instances globally like core does.
- Merge schema defaults with item data like Hydrogen.
- Preserve `ref` for Studio selection overlays.
- Support `setData()` and `triggerUpdate()` semantics expected by bridge.
- Optionally support translation snapshot merge.

## Runtime creation flow

Current render flow:

```text
WeaverseNextRenderer
  -> new Weaverse(...)
  -> <WeaverseRoot />
```

Proposed design-mode-capable flow:

```text
WeaverseNextRenderer / Provider
  -> register components in browser
  -> build normalized page data with rootId
  -> create/reuse WeaverseNextRuntime(pageId + requestInfo key)
  -> window.__weaverses[pageId] = runtime
  -> <WeaverseRoot context={runtime} />
  -> <WeaverseNextStudioBridge runtime={runtime} />
```

Runtime reuse should follow Hydrogen's rule:

```text
reuse while same pageId + pathname + search
create fresh on real navigation/request change
```

This preserves subscriptions for in-place updates but avoids stale page binding across navigations.

## Root-level connect component

Hydrogen equivalent:

```text
withWeaverse() -> <StudioConnect /> -> useStudioConnect()
```

Next equivalent options:

### Option A — explicit root component

Consumer adds to app layout:

```tsx
// app/layout.tsx or app/providers.tsx
<WeaverseNextStudioConnect />
{children}
```

Pros:

- Clear and Hydrogen-equivalent.
- Works on 404/error/content-less routes.
- Does not require every page to render Weaverse content.

Cons:

- Extra setup step for consumers.

### Option B — provider-integrated connect

`WeaverseNextProvider` always mounts the connect hook.

Pros:

- Fewer public components.

Cons:

- Only works where provider is mounted.
- Can still false-timeout on 404/error routes.

Recommendation: **Option A for full parity**, with Option B allowed as a convenience for POC/minimal apps.

## Page-level bind component

Hydrogen equivalent:

```text
<StudioBridge context={weaverse} /> -> useStudio(weaverse)
```

Next equivalent:

```tsx
function WeaverseNextStudioBridge({ runtime, navigate, refresh }) {
  // If design mode:
  // - set runtime.internal.navigate
  // - set runtime.internal.revalidate
  // - set runtime.internal.themeSettingsStore
  // - load script
  // - wait for window.weaverseStudio
  // - call window.weaverseStudio.init(runtime)
}
```

### Navigation/revalidation mapping

If using direct Next imports:

```ts
let router = useRouter()
runtime.internal.navigate = (to) => router.push(to, { scroll: false })
runtime.internal.revalidate = () => router.refresh()
```

If keeping runtime framework-callback based:

```ts
<WeaverseNextProvider
  navigate={(to) => router.push(to, { scroll: false })}
  refresh={() => router.refresh()}
/>
```

Recommendation:

- Implement the internal runtime around generic callbacks.
- Provide a Next-specific helper component that wires `useRouter()`.
- This keeps tests and future adapters simpler.

## Script URL resolver

Reuse Hydrogen logic as closely as possible:

```text
getStudioScriptSrc(mode)
resolveStudioScriptSrc(search, storefrontHostname)
isTrustedStudioHost(host, { allowLoopback })
```

Initial output path can remain:

```text
${weaverseHost}/static/studio/hydrogen/index.js?v=${weaverseVersion}
```

because the first phase reuses the existing bridge.

If Builder split becomes necessary, change only the resolver path:

```text
${weaverseHost}/static/studio/next/index.js?v=${weaverseVersion}
```

## Request info builder

Add a helper to normalize Next request/search data into Hydrogen-like shape:

```ts
interface WeaverseNextRuntimeRequestInfo {
  pathname: string
  search: string
  queries: Record<string, string | boolean>
  i18n: WeaverseNextI18n
}
```

Inputs:

```ts
url?: URL | string
pathname?: string
searchParams?: URLSearchParams | Record<string, string | string[] | undefined>
i18n?: WeaverseNextI18n
```

Rules:

- Keep last duplicate query value, matching Hydrogen `getRequestQueries()` behavior.
- Preserve Studio control queries in `requestInfo.queries`.
- Preserve original `search` for route identity/rebind.
- Do not include secrets.

## Theme settings store compatibility

Create a small store compatible with Hydrogen bridge expectations:

```ts
interface WeaverseNextThemeSettingsStore {
  schema: unknown
  settings: Record<string, unknown>
  publicEnv?: Record<string, string | undefined>
  subscribe(listener): () => void
  getSnapshot(): Record<string, unknown>
  getServerSnapshot(): Record<string, unknown>
  setSettings(next): void
}
```

The store should back both:

- `useThemeSettings()` hook in Next components.
- `weaverse.internal.themeSettingsStore` for Builder bridge.

## Data flow: published mode

```text
Next route/server component
  -> build request context
  -> fetch page/theme data through app/client utility
  -> pass serializable data to client wrapper
  -> create runtime
  -> render WeaverseRoot
```

No Studio script should load in normal published mode.

## Data flow: design mode

```text
Builder iframe URL
  -> Next route receives ?isDesignMode=true&weaverseProjectId=...&weaverseHost=...
  -> server fetch bypasses stale cache
  -> client runtime receives requestInfo/configs/page/theme/project/pageAssignment
  -> root connect loads bridge script
  -> page bind calls studio.init(runtime)
  -> bridge syncs schemas/page data/theme config to editor
  -> editor marks Studio ready
```

## Proposed public API shape

### Minimal POC API

```tsx
'use client'

import {
  createWeaverseNextClient,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  WeaverseNextStudioConnect,
} from '@weaverse/next'

export function WeaverseClientBoundary(props) {
  let client = createWeaverseNextClient({
    projectId: props.projectId,
    components,
    requestContext: props.requestContext,
    themeSchema: props.themeSchema,
    themeSettings: props.themeSettings,
  })

  return (
    <>
      <WeaverseNextStudioConnect />
      <WeaverseNextProvider client={client} runtimeConfig={props.runtimeConfig}>
        <WeaverseNextRenderer data={props.data} dataContext={props.dataContext} />
      </WeaverseNextProvider>
    </>
  )
}
```

### Production-quality API direction

For real apps, avoid creating the client object in a Server Component and passing it through RSC. Use:

```text
Server Component:
  fetch serializable data/config
  pass to Client Boundary

Client Boundary:
  import components
  create client/runtime
  render provider/renderer/studio bridge
```

This matches the existing Next adapter guidance and avoids empty browser registries.

## Builder split fallback architecture

Only if reuse fails:

```text
builder/studio/core/
  bridge.ts
  rpc-methods.ts
  data.ts
  selection.ts

builder/studio/adapters/hydrogen.ts
builder/studio/adapters/next.ts

output:
  /static/studio/hydrogen/index.js
  /static/studio/next/index.js
```

Adapter-specific parts:

| Concern | Hydrogen | Next |
| --- | --- | --- |
| Runtime type import | `@weaverse/hydrogen` | structural/shared type |
| Navigation | React Router navigate | Next router callback |
| Revalidation | React Router revalidator | router.refresh/server refresh |
| Request info | React Router request | Next URL/search params |

Shared parts:

- RPC endpoint.
- Selection/overlay UI.
- Page data generation if runtime shape is common.
- Schema migration/visibility.
- Add/delete/duplicate/move item operations.

## Implementation slices

### Slice 1 — runtime + script load unit tests

- Add script URL resolver copied/generalized from Hydrogen.
- Add `WeaverseNextRuntime` and `WeaverseNextItem` with tests.
- Add runtime request info builder.
- Add theme settings store.

Acceptance:

- Unit tests prove runtime has required fields/methods.
- No actual Builder/browser Studio yet.

### Slice 2 — client Studio bind component

- Add root connect component.
- Add page bind component.
- In tests, mock `window.weaverseStudio.init` and assert it receives runtime.

Acceptance:

- Design-mode search loads correct script URL.
- Bind calls `init()` once per page/request identity.
- Published mode does not load scripts.

### Slice 3 — POC direct design-mode smoke

- Update POC to pass real project id/configs/requestInfo.
- Deploy or run locally.
- Verify browser probe shows `hasStudio: true` and bridge script loaded.

Acceptance:

- Direct design-mode URL passes probe.
- No browser console errors.

### Slice 4 — actual Builder Studio smoke

- Add POC preview URL in Builder.
- Verify editor handshake and basic operations.

Acceptance:

- Studio shows connected, not timeout.
- Outline appears.
- Selecting/hovering sections works.
- Editing a text field updates preview and draft state.

### Slice 5 — parity hardening

- Revalidation with component loaders.
- Template/page switching.
- Translation/static text sidecar.
- 404/error route root-level connect.
- Nested/multiple Weaverse instances.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Existing bridge has hidden Hydrogen assumptions | Reuse first, document concrete failures, split only if necessary |
| Direct Next imports force `next` dependency | Use callbacks internally; optional helper can import `next/navigation` |
| Runtime global state leaks across pages | Key reuse by pageId + pathname + search; clear/update carefully |
| `router.refresh()` does not preserve bridge binding | Re-init on requestInfo/pageId changes; mirror Hydrogen refreshStudio behavior |
| Theme/translation parity expands scope | Define first Studio smoke as connection + basic edit; defer translation if needed |
| Components drop `data-wv-*` props | Keep smoke components/tests that assert attrs are present |

## Recommended first implementation target

Do **not** start with Builder changes.

Start in `packages/next`:

1. Runtime class.
2. Theme settings store.
3. Script resolver.
4. Studio connect/bind components.
5. Tests.
6. POC direct smoke.

Only after that decide if Builder needs a dedicated Next bridge entrypoint.
