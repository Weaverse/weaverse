# Work Logs

## 2026-07-22 — @hta218

### Investigation

- Confirmed `revalidateWeaverseNextItem()` posts only `{ draftItem }`.
- Confirmed `createWeaverseNextRevalidateHandler()` passes its own API-route
  `Request` to `getClient()` and runs the loader with `client.requestContext`.
- Confirmed the production POC callback ignores the endpoint request and creates
  a client from empty search params, which falls back to pathname `/` and no
  locale.
- Confirmed the POC resource-picker smoke loader uses real Shopify Storefront API
  data but does not inspect route context, so the existing successful smoke does
  not prove context parity.
- Confirmed the runtime already owns a stable, client-safe `requestInfo` snapshot
  and recreates/rebinds it across pathname, search, and locale navigation.
- Confirmed the server config resolver reads security-sensitive query controls:
  `weaverseProjectId`, `weaverseHost`, and `weaverseApiKey`. Raw runtime search
  must therefore not be forwarded without sanitization.

### Decision

- Carry a narrow `routeContext` beside `draftItem`.
- Source it from the active runtime, not `window.location` or Builder RPC input.
- Preserve pathname, ordinary search parameters, locale/i18n, page type, and
  handle.
- Strip project/host/API-key/API-base/version controls and transient draft/RSC
  parameters on both sides of the trust boundary.
- Reconstruct `WeaverseNextRequestContext` inside the SDK route handler and pass
  it as an optional second argument to `getClient(request, requestContext)`.
- Keep missing `routeContext` backward compatible for old clients.
- Require no Builder contract change; `internal.revalidateItem(draftItem)` keeps
  its current signature.

### Output

Spec-only branch. No package or POC implementation is included in this PR.

### Spec review

- Repository SDD validation passed: required files/metadata are present,
  relative links resolve, branch naming is valid, and `plan.md` is under 500
  lines.
- Frozen-diff scope/secret scan passed; all referenced SDK/POC paths and current
  contract assertions were checked against source.
- Copilot autoreview was unavailable due quota exhaustion (HTTP 402).
- Claude Code no-tools review found one SDD traceability blocker plus table/auth
  clarifications; all were fixed. The second pass returned `APPROVE` with no
  blockers.
