# Spec: Next.js Studio Bridge compatibility

| Field | Value |
| --- | --- |
| Status | Draft for architecture review |
| Issue | [Weaverse/builder#2533](https://github.com/Weaverse/builder/issues/2533) |
| Repository | `Weaverse/weaverse` |
| Related repos | `Weaverse/builder`, `Weaverse/weaverse-hydrogen-next-poc`, `Weaverse/pilot` |
| Owner | Weaverse SDK team |
| Date | 2026-06-21 |
| Scope | Architecture/spec first; no runtime implementation in this spec commit |

## Executive summary

The current `@weaverse/next` alpha proves that a Next.js App Router storefront can render a serialized Weaverse page tree. It does **not** yet prove Studio connectivity.

The reason is architectural: Weaverse Studio is not only an iframe preview. Studio requires a bidirectional bridge between the Builder editor frame and the storefront preview iframe. The existing bridge is wired for `@weaverse/hydrogen` and assumes a `WeaverseHydrogen`-like runtime object. The current `@weaverse/next` renderer uses bare `Weaverse` from `@weaverse/react`, so the page can render `.weaverse-content-root` and `data-wv-*` attributes but never loads/binds the Studio bridge.

The recommended path is:

1. Keep this spec in the SDK repo as source of truth.
2. Reuse the existing Builder bridge first, because it is mostly structural.
3. Add a Next-specific runtime layer in `@weaverse/next` that satisfies the bridge contract.
4. Only split Builder into a framework-neutral bridge or `/static/studio/next/index.js` if reuse proves too coupled.

## Decision: where this knowledge lives

Store the detailed architecture/spec in the SDK repo under:

```text
.weaverse/specs/2026-06-21--next-studio-bridge/
```

Why repo-local markdown instead of PDF/Drive:

- Agents and humans can read it with normal repo tools.
- GitHub PR review gives inline comments and history.
- The spec can evolve next to the implementation diff.
- It can be linked from Builder issue `#2533` without duplicating content.
- It avoids stale exported docs that drift from code.

A short issue comment can link to this folder/PR, but this folder is the source of truth.

## Reading map

Read in this order:

1. [`01-builder-studio-bridge-audit.md`](./01-builder-studio-bridge-audit.md) — Builder editor frame + preview bridge architecture.
2. [`02-hydrogen-sdk-contract.md`](./02-hydrogen-sdk-contract.md) — Existing Hydrogen SDK runtime contract that makes Studio work.
3. [`03-next-adapter-gap-analysis.md`](./03-next-adapter-gap-analysis.md) — Current `@weaverse/next` gaps and POC evidence.
4. [`04-proposed-next-architecture.md`](./04-proposed-next-architecture.md) — Proposed solution architecture and implementation phases.
5. [`05-verification-plan.md`](./05-verification-plan.md) — Unit, integration, browser, and actual Studio smoke plan.
6. [`work-log.md`](./work-log.md) — Investigation evidence and exact files inspected.

## Goals

- Document how Builder Studio connects to a storefront preview today.
- Define the minimum runtime shape `@weaverse/next` must provide.
- Propose an implementation architecture that preserves Hydrogen behavior and keeps v0 scope controlled.
- Produce a spec that another agent/engineer can implement or review without Slack/thread context.

## Non-goals

- Do not implement code in this spec step.
- Do not replace `@weaverse/hydrogen`.
- Do not rewrite Builder Studio before proving reuse is impossible.
- Do not solve full Pilot parity in this slice.
- Do not expose server-only API keys/tokens to the client.
- Do not turn the POC into production infrastructure.

## Current status

Already proven:

- `@weaverse/next` can render real Weaverse API page data in a Next.js App Router POC.
- A lightweight subset of Pilot homepage section types can render in the POC.
- DOM has `.weaverse-content-root` and `data-wv-*` markers when components forward props correctly.

Not yet proven:

- Preview iframe loads the Studio bridge script.
- `window.weaverseStudio` exists in the Next preview frame.
- Builder editor can call `PreviewRPC.call.checkWeaversePage()` successfully.
- Builder can sync schemas/page data/theme settings from a Next runtime instance.
- Selection, outline, inspector edits, revalidation, and route navigation work in actual Studio.

## Core problem statement

The current render-only `@weaverse/next` runtime creates a bare `Weaverse` instance:

```text
@weaverse/next renderer
  -> new Weaverse({ projectId, data })
  -> <WeaverseRoot context={instance} />
```

The existing Studio bridge expects a richer runtime:

```text
WeaverseHydrogen-like instance
  -> pageId
  -> requestInfo
  -> internal.navigate
  -> internal.revalidate
  -> internal.themeSettingsStore
  -> internal.project/pageAssignment
  -> Studio script load/init lifecycle
```

Therefore a Next preview can render content but still be invisible to Studio.

## Proposed high-level architecture

```text
Next App Router route/server component
  -> fetch Weaverse page/theme data
  -> pass serializable data into client boundary

@weaverse/next client boundary
  -> create/register components in browser
  -> create WeaverseNext runtime instance
  -> render <WeaverseRoot context={runtime} />
  -> load Studio bridge when design/preview query markers are present
  -> call window.weaverseStudio.init(runtime)

Existing Builder Studio bridge
  -> sees a WeaverseHydrogen-compatible runtime shape
  -> syncs preview data back to editor
  -> marks Studio ready
```

## Recommended implementation phases

### Phase 0 — spec review

- Commit this spec folder.
- Ask Claude/Codex/Paul/team to review the architecture before code.
- Link this folder/PR from Builder issue `#2533`.

### Phase 1 — SDK runtime compatibility in `@weaverse/next`

Add Next equivalents for Hydrogen's Studio lifecycle:

- Root-level script connect equivalent to `useStudioConnect()`.
- Page-level bind equivalent to `useStudio(weaverse)`.
- `WeaverseNext` runtime class extending/adapting `Weaverse`.
- Next App Router mapping for `navigate` and `revalidate`.
- Theme settings store compatibility.
- Request info/query propagation.

### Phase 2 — POC Studio smoke

Update the POC to mount the new Next Studio boundary and pass real project/runtime metadata. Verify the direct design-mode URL before opening actual Studio.

### Phase 3 — actual Builder Studio smoke

Connect the POC storefront as a preview URL in Builder and verify:

- Handshake.
- Outline load.
- Hover/selection.
- Inspector data sync.
- Simple text update.
- Section add/delete/move.
- Revalidation path.

### Phase 4 — Builder bridge split only if needed

If the existing `/static/studio/hydrogen/index.js` cannot be reused cleanly, split the Builder bridge into shared core + adapter entrypoints.

## Acceptance criteria for this spec

This spec is review-ready when it:

- Names all important files on Builder and SDK sides.
- Documents the bridge RPC lifecycle.
- Documents the required runtime instance contract.
- Identifies concrete gaps in current `@weaverse/next`.
- Proposes an implementation path with fallback architecture.
- Provides verification probes and pass/fail criteria.

## Open questions

- Should the public API expose `WeaverseNextStudioProvider`, or should Studio support be implicit in `WeaverseNextProvider`?
- Should `@weaverse/next` import `next/navigation`, making `next` a peer dependency, or should navigation/revalidation be adapter callbacks supplied by the app?
- How much of `WeaverseHydrogen` can be generalized into `@weaverse/react` without destabilizing Hydrogen?
- Should Builder keep the path `/static/studio/hydrogen/index.js` for both frameworks, or should it eventually serve `/static/studio/next/index.js`?
- How should translation sidecar/static text drafts be scoped in App Router across `router.refresh()`?
