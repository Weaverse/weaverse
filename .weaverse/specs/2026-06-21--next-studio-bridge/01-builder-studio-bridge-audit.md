# 01 — Builder Studio Bridge audit

This document describes the Builder side of the Studio connection. The important detail: Studio is a two-context RPC system, not a passive iframe preview.

## Contexts

### 1. Editor frame

Location:

```text
builder/app/routes/studio/workspace/
```

Key files:

```text
builder/app/routes/studio/workspace/preview/main-preview.tsx
builder/app/stores/rpc/preview.ts
builder/app/stores/rpc/methods.ts
builder/app/stores/editor.ts
builder/app/routes/studio/workspace/effect-only.tsx
```

Responsibilities:

- Render the storefront preview in an iframe.
- Append Studio control query params to the iframe URL.
- Create an editor-side RPC endpoint to talk to the preview iframe.
- Expose editor-callable methods to the preview frame.
- Detect connection success/failure.
- Maintain editor state: selected item, outline, page data, theme config, locale, dirty state.

### 2. Preview iframe bridge

Location:

```text
builder/studio/
```

Key files:

```text
builder/studio/index.ts
builder/studio/rpc/endpoint.ts
builder/studio/rpc/methods.ts
builder/studio/weaverse/instance.ts
builder/studio/weaverse/page-outline.ts
builder/studio/weaverse/schema.ts
builder/studio/utils/data.ts
builder/studio/utils/events.ts
builder/studio/build-studio.ts
```

Responsibilities:

- Run inside the merchant storefront preview iframe.
- Create `window.weaverseStudio`.
- Expose preview-side RPC methods to the editor.
- Bind to a live Weaverse runtime instance.
- Read DOM refs and item instances.
- Forward selection/hover/click events to the editor.
- Mutate item data in response to editor actions.
- Generate page save data from runtime item stores.

## Build/output path

Builder builds the preview bridge via:

```text
builder/studio/build-studio.ts
```

Current entrypoints:

```ts
const ENTRYPOINTS = [
  './studio/style.ts',
  './studio/index.ts',
  './studio/preview.ts',
]
```

Current output:

```text
builder/public/static/studio/hydrogen/
  index.js
  preview.js
  style.js/style.css assets
```

The naming says `hydrogen`, but much of the runtime contract is structural. This is why the first attempt should reuse it with a Next-compatible runtime object before introducing a new Builder output path.

## Editor iframe setup

File:

```text
builder/app/routes/studio/workspace/preview/main-preview.tsx
```

Important flow:

```text
<MainPreview />
  -> compute active preview host
  -> append Editor.studioQueries
  -> set iframe.src
  -> createEndpoint(fromIframe(frame))
  -> endpoint.expose(EditorCallableMethods)
  -> PreviewRPC.call = endpoint.call
  -> iframe load event calls checkStudioScript()
```

`Editor.studioQueries` is initialized in:

```text
builder/app/routes/studio/workspace/effect-only.tsx
```

Important query params:

```text
isDesignMode=true
weaverseProjectId=<project id>
weaverseHost=<studio host>
weaverseVersion=<builder/sdk version cache buster>
weaverseTemplateId=<optional>
```

The iframe `src` is the active preview URL plus these params.

## Connection handshake

After iframe `load`, Builder waits then calls:

```ts
PreviewRPC.call.checkWeaversePage()
```

Implemented in:

```text
builder/studio/rpc/methods.ts
```

Current behavior:

```ts
checkWeaversePage = () => {
  let weaverseContentRoot = document.querySelector('.weaverse-content-root')
  return weaverseContentRoot ? 'IS_WEAVERSE_PAGE' : 'NOT_WEAVERSE_PAGE'
}
```

Expected outcomes:

| Result | Meaning |
| --- | --- |
| `IS_WEAVERSE_PAGE` | iframe has a Weaverse root and RPC bridge responded |
| `NOT_WEAVERSE_PAGE` | bridge loaded, but no Weaverse content root |
| timeout/`ERROR` | bridge did not load/respond |

Important distinction:

- `.weaverse-content-root` alone is not enough.
- `checkWeaversePage()` must be callable through RPC.
- If no bridge script runs, Builder times out even if the page visually renders Weaverse sections.

## Preview-side RPC endpoint

File:

```text
builder/studio/rpc/endpoint.ts
```

Flow:

```ts
EditorRPC = createEndpoint(fromInsideIframe())
EditorRPC.expose(PreviewCallableMethods)
```

This creates the preview-side RPC endpoint and exposes methods from:

```text
builder/studio/rpc/methods.ts
```

The editor calls those methods through `PreviewRPC.call.*`.

## Bridge bootstrap

File:

```text
builder/studio/index.ts
```

The bridge class constructor:

```text
new HydrogenStudioBridge()
  -> window.weaverseStudio = this
  -> PreviewCallableMethods.studio = this
```

At the end of the bundle:

```ts
window.parent?.postMessage(
  { type: 'WEAVERSE_STUDIO_SCRIPT_LOADED', origin: window.location.origin },
  '*'
)
```

This postMessage exists, but editor connection state is still primarily validated by RPC + `checkWeaversePage()`.

## Binding a runtime instance

The bridge only becomes useful after SDK code calls:

```ts
window.weaverseStudio.init(weaverse)
```

`init()` does the heavy work:

```text
resolveEditingInstance(...)
  -> assign weaverse.studioBridge = this
  -> this.weaverse = weaverse
  -> setInitialData()
  -> add window events
  -> observe URL changes
  -> load custom Studio styles
  -> hydrate local draft
  -> restore static text drafts
  -> syncDataWithEditor()
  -> updatePageOutline(...)
  -> weaverse.triggerUpdate()
  -> toggleSelected(null)
  -> EditorRPC.call.setStudioStateReady()
```

If the script loads but `init()` is never called, Studio may answer some RPC calls but it cannot edit the page correctly.

## Editor-callable methods exposed to preview

File:

```text
builder/app/stores/rpc/methods.ts
```

Important methods preview calls on editor:

| Method | Purpose |
| --- | --- |
| `syncPreviewData(data)` | Sync page data, schemas, theme config, request info, dynamic data context |
| `setStudioStateReady()` | Mark Studio as connected and flush startup state |
| `getEditingPageId()` | Disambiguate nested/multiple Weaverse instances on one URL |
| `toggleSelected(info)` | Update selected item in editor sidebar/outline |
| `onBeforeNavigate(to)` | Let editor update preview path before iframe navigation |
| `syncPreviewPath(href)` | Keep editor browser bar in sync with preview location |
| `silentUpdate(payload)` | Receive local page draft after preview mutation |
| `getDraftPage(pageId)` | Rehydrate unsaved editor draft into preview |
| `updatePageOutline(...)` | Refresh left sidebar outline |
| `finishLoading()` | Stop loading state after revalidation |
| `updateStaticTextDraft(...)` | Persist static text edits across iframe reloads |

The Next runtime must supply enough data for `syncPreviewData()` to be meaningful.

## Preview-callable methods exposed to editor

File:

```text
builder/studio/rpc/methods.ts
```

Important methods editor calls on preview:

| Method | Purpose | Runtime dependencies |
| --- | --- | --- |
| `checkWeaversePage()` | Handshake/content check | DOM `.weaverse-content-root` |
| `updateItemData(update, shouldRevalidate?)` | Inspector field update | item instances, schema, silent update, optional revalidate |
| `addItem(...)` | Add section/block | schemas, presets, item constructor, root instance |
| `deleteItem(id)` | Remove section/block | parent lookup, item data mutation |
| `duplicateItem(id)` | Clone subtree | item instances, schemas/presets |
| `swapItems(activeId, overId)` | DnD reorder | parent/children arrays |
| `selectElement(id)` | Select item from outline/scoring | DOM refs and item instances |
| `getPagesData()` | Save payload for all active instances | `window.__weaverses`, `generatePageData()` |
| `getItemDataById(id)` | AI/tooling context | item instance tree |
| `navigate(to)` | Studio-driven preview navigation | `weaverse.internal.navigate` |
| `refreshPage()` | Force route refresh/rebind | navigation + query cache buster |
| `revalidate(id?)` | Re-run loaders and refresh selected item | `weaverse.internal.revalidate`, item loader data |
| `enableInteraction()` | Hover/click selection overlay | event handlers + `weaverse.triggerUpdate()` |
| `disableInteraction()` | Disable overlay interaction | event handlers + `weaverse.triggerUpdate()` |
| `batchUpdatePageItems(items)` | AI/bulk update path | item instances + `setData()` |
| `getComponentSchemas()` | AI/tooling/schema panel | `studio.schemas` |
| `getThemeSettings()` | AI/tooling/theme panel | `weaverse.internal.themeSettingsStore` |
| `restoreTranslationDraft(...)` | Translation sidecar | `weaverse.setTranslationSidecar()` |
| `importPageTemplate(template)` | Replace page tree | item constructor, rootId, revalidation |

## DOM requirements

`@weaverse/react` renders:

```text
<div class="weaverse-content-root"
     data-weaverse-project-id="..."
     data-weaverse-template-id="...">
  ... registered item components with data-wv-id/data-wv-type ...
</div>
```

Every registered component must forward props like:

```tsx
<section {...rest}>...</section>
```

Otherwise Studio cannot select/outline elements because `data-wv-id` and refs are lost.

## Key insight

Studio has three different readiness levels:

| Level | What passes | What still fails |
| --- | --- | --- |
| Visual iframe preview | Page renders inside iframe | No RPC, no edit bridge |
| Bridge script loaded | `window.weaverseStudio` exists and RPC responds | No page binding unless `init(weaverse)` ran |
| Full Studio connection | `init()` synced data and `setStudioStateReady()` fired | Feature-specific edit/revalidation bugs may remain |

The POC is currently at level 1 only.
