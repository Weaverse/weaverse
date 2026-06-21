# 04 — Verification plan

Studio support must be verified in layers. A rendered iframe is not enough.

## L0 — Unit/runtime tests

Target: `packages/next`.

Required cases:

- Runtime exposes `pageId`, `projectId`, `requestInfo`, `data`, `dataContext`, `internal`.
- Runtime registers/reuses browser instances by page/request identity.
- Runtime distinguishes first bind vs reused render.
- Mocked `window.weaverseStudio.init` is called once for first bind.
- Mocked `window.weaverseStudio.refreshStudio` is called for reused design-mode updates.
- Theme store exposes `schema`, `settings`, `publicEnv`, `subscribe`, `getSnapshot`, `getServerSnapshot`, and `updateThemeSettings`.
- Request info builder preserves `pathname`, `search`, Studio control queries, and locale data.
- Script resolver rejects untrusted Studio hosts and does nothing in published mode.
- Component schema shape is compatible with Studio inspector visibility expectations.
- Published-mode URL loads no Studio script.

## L1 — Direct render smoke

Target: Next POC route.

Browser probe should verify:

- `.weaverse-content-root` exists.
- `data-wv-id` and `data-wv-type` exist on rendered sections.
- Real expected section types render.
- `data-weaverse-project-id` is the real project id, not a fallback or `poc-test`.
- Browser console has no hydration/runtime errors.

## L2 — Direct design-mode bridge smoke

Open the route with Studio design-mode query params.

Browser probe should verify:

- Studio script loaded.
- `window.weaverseStudio` exists.
- Runtime global(s) exist.
- Active runtime has `pageId`, `projectId`, `requestInfo`, `internal.navigate`, `internal.revalidate`, `internal.themeSettingsStore`, and `internal.pageAssignment`.
- First bind calls `init`.
- A data/request update calls `refreshStudio`.
- Design-mode fetches bypass stale cache.

## L3 — Iframe embeddability smoke

Before testing actual Studio behavior, verify the storefront can be framed by Studio:

- Response headers do not block Studio iframe usage.
- CSP `frame-ancestors` allows the configured Studio origin.
- No browser frame-blocking errors appear.

## L4 — Actual Studio handshake smoke

Use a real Studio workspace with the POC preview URL.

Pass criteria:

- Studio does not timeout on connection.
- Preview responds to the bridge handshake.
- Outline/sidebar receives a section tree.
- Selecting a visible section from Studio targets the correct DOM element.

## L5 — Basic editing smoke

Actions:

1. Select a simple text-bearing section.
2. Change one inspector field.
3. Confirm preview updates.
4. Confirm draft/save payload includes the changed data.
5. Confirm no bridge disconnect after the update.

## L6 — Revalidation/navigation smoke

Actions:

- Edit or refresh a loader-backed section.
- Confirm refresh/revalidation callback runs.
- Confirm fresh server data reaches the client runtime.
- Confirm Studio receives a refresh/update signal after the runtime data changes.
- Navigate to another preview path and back.

## L7 — Later parity hardening

- Page selector rebind when multiple page IDs can share a route.
- Nested/multiple Weaverse instances on one route.
- Translation/static text sidecar.
- 404/error-route root-level connect.
- Mobile/desktop overlay geometry.

## Reporting template

```text
Package version/commit:
POC branch/commit:
Preview URL:
Design-mode URL:
Frame headers:
Direct probe result:
Studio handshake result:
Basic edit result:
Revalidation result:
Console errors:
Known caveats:
Next follow-up:
```

Do not claim “Studio works” unless actual Studio handshake and basic editing pass.
