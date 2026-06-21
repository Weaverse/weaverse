# 05 — Verification plan

Studio support must be verified in layers. A visually rendered iframe is not enough.

## Verification levels

| Level | Name | What it proves | Example pass signal |
| --- | --- | --- | --- |
| L0 | Unit/runtime | Runtime object and helpers satisfy contract | tests pass |
| L1 | Direct render | Next renders Weaverse DOM | `.weaverse-content-root` and `[data-wv-id]` exist |
| L2 | Direct bridge | Design-mode URL loads bridge and exposes RPC | `!!window.weaverseStudio === true` |
| L3 | Editor handshake | Builder iframe can call preview RPC | `checkWeaversePage() === IS_WEAVERSE_PAGE` and Studio ready |
| L4 | Basic editing | Selection/inspector updates mutate preview | Text/style update visible and draft synced |
| L5 | Revalidation/navigation | Loader-backed and route changes work | `router.refresh()`/navigation rebinds correctly |
| L6 | Parity hardening | Translation/templates/nested pages/error routes | feature-specific smoke passes |

## L0 — Unit/runtime tests

Target package:

```text
packages/next
```

Commands:

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__
```

Required test cases:

### Runtime shape

- `WeaverseNextRuntime` exposes `pageId`, `requestInfo`, `internal`, `projectId`, `data`, `dataContext`.
- Runtime registers in `window.__weaverses[pageId]` in browser-like environment.
- Runtime uses real project id from configs/data, not fallback when provided.
- Runtime root id follows current behavior: explicit `rootId`, then first `main`, then fallback.

### Item store

- `WeaverseNextItem` merges schema defaults below item data.
- `getSnapShot()` is stable when data does not change.
- `setData()` triggers subscribers.
- Component refs are available for Studio selection.

### Request info

- Build request info from URL/search params.
- Duplicate query keys keep last value, matching Hydrogen behavior.
- `isDesignMode`, `isPreviewMode`, `__revisionId`, `weaverseProjectId`, `weaverseHost`, and `weaverseVersion` are parsed.
- No secrets are included.

### Script resolver

- Published URL returns `null`.
- Design mode returns `/static/studio/hydrogen/index.js` URL.
- Preview/revision returns `/static/studio/hydrogen/preview.js` URL.
- Untrusted `weaverseHost` returns `null`.
- Loopback host allowed only when storefront hostname is loopback.

### Studio bind

Use a browser-like test environment with mocked globals:

```ts
window.weaverseStudio = { init: vi.fn() }
```

Assert:

- `init(runtime)` is called in design mode.
- `init()` is not called in published mode.
- Runtime `internal.navigate` and `internal.revalidate` are set before `init()`.
- Bind is idempotent for same page/request identity.
- Bind re-runs for changed pageId/pathname/search.

## L1 — Direct render smoke

Target:

```text
weaverse-hydrogen-next-poc
```

Verify normal route:

```text
/weaverse-next-test
```

Browser probe:

```js
({
  hasRoot: !!document.querySelector('.weaverse-content-root'),
  rootCount: document.querySelectorAll('.weaverse-content-root').length,
  itemCount: document.querySelectorAll('[data-wv-id]').length,
  types: Array.from(document.querySelectorAll('[data-wv-type]')).map((el) => el.getAttribute('data-wv-type')),
  roots: Array.from(document.querySelectorAll('.weaverse-content-root')).map((el) => ({
    projectId: el.getAttribute('data-weaverse-project-id'),
    templateId: el.getAttribute('data-weaverse-template-id'),
  })),
})
```

Pass criteria:

- `hasRoot === true`.
- `itemCount > 0`.
- Real expected section types are present.
- `projectId` is the real runtime project id, not `poc-test` or fallback.
- Browser console has no hydration/runtime errors.

## L2 — Direct design-mode bridge smoke

Open direct preview route with Studio query params:

```text
/weaverse-next-test?isDesignMode=true&weaverseProjectId=<project-id>&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=<version>
```

Do not commit real env values. Use placeholders in docs and local/Vercel env for actual values.

Browser probe:

```js
({
  hasStudio: !!window.weaverseStudio,
  hasInit: typeof window.weaverseStudio?.init === 'function',
  scripts: Array.from(document.scripts)
    .map((s) => s.src)
    .filter((src) => src.includes('/static/studio') || src.includes('weaverse')),
  hasRoot: !!document.querySelector('.weaverse-content-root'),
  roots: Array.from(document.querySelectorAll('.weaverse-content-root')).map((el) => ({
    projectId: el.getAttribute('data-weaverse-project-id'),
    templateId: el.getAttribute('data-weaverse-template-id'),
  })),
  weaverses: Object.keys(window.__weaverses || {}),
  current: window.__weaverse && {
    pageId: window.__weaverse.pageId,
    projectId: window.__weaverse.projectId,
    hasRequestInfo: !!window.__weaverse.requestInfo,
    hasNavigate: typeof window.__weaverse.internal?.navigate === 'function',
    hasRevalidate: typeof window.__weaverse.internal?.revalidate === 'function',
    hasThemeStore: !!window.__weaverse.internal?.themeSettingsStore,
  },
})
```

Pass criteria:

- `hasStudio === true`.
- `scripts` includes Studio bridge script.
- `window.__weaverse` exists after bind.
- `current.hasRequestInfo === true`.
- `current.hasNavigate === true`.
- `current.hasRevalidate === true`.
- `current.hasThemeStore === true`.
- Browser console has no bridge/runtime errors.

## L3 — Editor handshake smoke

Use actual Builder Studio with the POC preview URL configured.

Signals to observe:

- Studio progress finishes.
- No connection timeout overlay.
- Frame status becomes connected.
- Page outline opens with real sections.
- `PreviewRPC.call.checkWeaversePage()` returns `IS_WEAVERSE_PAGE`.

If debug mode is available, enable editor RPC logs and look for:

```text
[EDITOR:syncPreviewData]
[EDITOR:setStudioStateReady]
[PREVIEW:checkWeaversePage]
```

Pass criteria:

- Editor frame marks Studio ready.
- Outline contains rendered Weaverse section tree.
- Selected page id matches the bound runtime page id.

## L4 — Basic editing smoke

Actions:

1. Select a visible heading/paragraph/button section.
2. Change a simple text field in inspector.
3. Verify preview updates without full disconnect.
4. Verify selected item remains selected or reselects after update.
5. Save draft path can collect page data through `getPagesData()`.

Pass criteria:

- Text update appears in preview.
- No bridge disconnect.
- `silentUpdate()` reaches editor.
- `getPagesData()` returns a page payload with changed data under the selected item.

## L5 — Revalidation/navigation smoke

Actions:

1. Trigger update on a loader-backed component such as featured products.
2. Confirm route refresh/revalidation completes.
3. Navigate within preview to another path and back.
4. If page selector uses same URL with different template/page id, force rebind.

Pass criteria:

- `router.refresh()` or callback equivalent runs.
- Studio rebinds to the fresh runtime/page data.
- LoaderData updates do not detach React subscriptions.
- `setStudioStateReady()` is not permanently stuck after refresh.

## L6 — Later parity smoke

These can be separate follow-up specs/tasks:

- Translation sidecar edit and save.
- Static text draft restore across locale switch.
- Template preview/import.
- Nested layout + child Weaverse instances on one URL.
- 404/error route should answer handshake through root-level connect.
- Mobile/desktop device switch and selection overlay geometry.
- AI agent tools using `getPagesData()`, `getComponentSchemas()`, `batchUpdatePageItems()`.

## Regression checks for POC components

Every smoke component must:

- Spread `...rest` on its DOM root.
- Preserve `data-wv-id` and `data-wv-type`.
- Forward/ref-compatible root element where practical.
- Avoid invalid HTML that causes hydration mismatch:
  - no nested `<main>` when app shell already has `<main>`,
  - no `<p>` wrapping rich HTML containing `<p>`.
- Respect `__hidden` if supplied.

## Failure triage matrix

| Symptom | Likely cause | Next check |
| --- | --- | --- |
| Page renders, Studio timeout | Script not loaded or RPC endpoint missing | Browser probe `hasStudio`, `scripts` |
| `hasStudio=true`, still timeout | RPC exposed but `checkWeaversePage` failing/throwing | Call/check preview console errors |
| `checkWeaversePage=IS_WEAVERSE_PAGE`, no outline | `studio.init()` not called or sync failed | Check `window.__weaverse`, `syncPreviewData` logs |
| Outline empty | schemas/rootInstance missing | Check component registration, rootId, item instances |
| Select/hover broken | components dropped attrs/refs | Inspect DOM for `data-wv-id`, refs |
| Inspector update no-op | item store/setData mismatch | Inspect item `_store`, `triggerUpdate()` |
| Revalidation disconnects | runtime replaced incorrectly | Check runtime reuse and `window.__weaverses` |
| Wrong project in Studio | POC hardcoded/fallback project id | Inspect `data-weaverse-project-id`, configs |

## Reporting template

When reporting a Studio smoke result, include:

```text
Package version/commit:
POC branch/commit:
Preview URL:
Design-mode URL:
Probe result:
Editor handshake:
Basic edit result:
Console errors:
Known caveats:
Next follow-up:
```

Do not claim “Studio works” unless L3 and L4 pass.
