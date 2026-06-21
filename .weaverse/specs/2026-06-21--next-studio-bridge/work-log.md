# Work log — Next Studio Bridge spec

## 2026-06-21 — Architecture reconnaissance

Goal: understand why the Next.js POC renders in an iframe but does not connect to Weaverse Studio.

### Repositories inspected

```text
/Users/hta218/Documents/work/workspace/builder
/Users/hta218/Documents/work/workspace/weaverse
/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc
```

### Git state at spec creation

```text
builder: dev...origin/dev
weaverse: main...origin/main
poc: test/weaverse-next-package...origin/test/weaverse-next-package
```

The spec files are created in `weaverse` because the implementation owner is `@weaverse/next` in the SDK monorepo. Builder is referenced as the bridge provider/consumer.

### Builder files inspected

Editor frame:

```text
builder/app/routes/studio/workspace/preview/main-preview.tsx
builder/app/routes/studio/workspace/effect-only.tsx
builder/app/stores/editor.ts
builder/app/stores/rpc/preview.ts
builder/app/stores/rpc/methods.ts
builder/app/stores/frame-status.ts
builder/app/utils/browser.ts
```

Preview bridge:

```text
builder/studio/index.ts
builder/studio/rpc/endpoint.ts
builder/studio/rpc/methods.ts
builder/studio/utils/data.ts
builder/studio/utils/events.ts
builder/studio/utils/load-assets.ts
builder/studio/weaverse/instance.ts
builder/studio/weaverse/page-outline.ts
builder/studio/weaverse/schema.ts
builder/studio/build-studio.ts
```

Repo docs/guidance:

```text
builder/AGENTS.md
builder/CLAUDE.md
builder/app/routes/studio/workspace/AGENTS.md
```

### SDK files inspected

Hydrogen:

```text
packages/hydrogen/src/WeaverseHydrogenRoot.tsx
packages/hydrogen/src/utils/use-studio.ts
packages/hydrogen/src/utils/studio-script-src.ts
packages/hydrogen/src/utils/index.ts
packages/hydrogen/src/weaverse-client.ts
packages/hydrogen/src/types.ts
```

React/core:

```text
packages/react/src/renderer.tsx
packages/react/src/hooks.ts
packages/react/src/types/index.ts
packages/core/src/core.ts
```

Next:

```text
packages/next/src/index.ts
packages/next/src/types.ts
packages/next/src/client.ts
packages/next/src/provider.tsx
packages/next/src/renderer.tsx
packages/next/src/loader.ts
packages/next/src/registry.ts
packages/next/__tests__/next-adapter.test.tsx
```

Repo docs/guidance:

```text
weaverse/AGENTS.md
weaverse/packages/react/AGENTS.md
weaverse/packages/hydrogen/AGENTS.md
```

### POC files inspected

```text
weaverse-hydrogen-next-poc/app/weaverse-next-test/page.tsx
weaverse-hydrogen-next-poc/app/weaverse-next-test/wrapper.tsx
weaverse-hydrogen-next-poc/app/weaverse-next-test/components.tsx
```

### Direct browser probe result

A direct POC design-mode URL was loaded with Studio query params. The page rendered real sections, but browser state showed:

```js
{
  hasRoot: true,
  hasStudio: false,
  itemCount: 20,
  scripts: [/* Next chunks only, no /static/studio script */]
}
```

Important interpretation:

- Rendering is successful.
- DOM markers exist.
- Studio bridge script is not loaded.
- `window.weaverseStudio` is missing.
- The preview is not connected to Builder Studio.

### Important findings

1. Builder Studio is a bidirectional RPC system using `@remote-ui/rpc`.
2. Editor frame creates `createEndpoint(fromIframe(frame))` and exposes `EditorCallableMethods`.
3. Preview bridge creates `createEndpoint(fromInsideIframe())` and exposes `PreviewCallableMethods`.
4. The bridge bundle is built from `builder/studio/index.ts` to `/static/studio/hydrogen/index.js`.
5. Hydrogen root-level `useStudioConnect()` loads the bridge script even on content-less routes.
6. Hydrogen page-level `useStudio(weaverse)` loads the script, waits for `window.weaverseStudio`, then calls `studio.init(weaverse)`.
7. `studio.init()` is the real bind/sync step; script loading alone is not enough.
8. The current `@weaverse/next` renderer uses bare `Weaverse`, which lacks the runtime shape expected by the bridge.
9. The POC wrapper hardcodes `projectId: 'poc-test'`, causing wrong DOM project id for Studio binding.
10. Reusing existing `/static/studio/hydrogen/index.js` should be attempted before changing Builder, because most assumptions are structural.

### Current architecture verdict

`@weaverse/next` currently passes render-runtime smoke but fails Studio-runtime smoke.

The implementation should not be a small POC-only patch. It needs a deliberate runtime compatibility layer in the SDK package.

### Proposed next action

1. Review this spec folder.
2. Open a spec-only PR or commit this spec to the working branch.
3. Ask Claude/Codex/team to review the architecture.
4. Implement Phase 1 from `04-proposed-next-architecture.md` only after spec review.

### Notes on secrets

No API keys, storefront tokens, private env values, or Vercel secrets are recorded in this spec. Use placeholders for project/env values in docs and keep actual values in local/Vercel env only.
