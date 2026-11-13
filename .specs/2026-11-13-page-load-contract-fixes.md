# Page-load contract fixes from the docs audit

Issue: [#597](https://github.com/Weaverse/weaverse/issues/597) (also closes [#517](https://github.com/Weaverse/weaverse/issues/517))

## Outcome

Themes on both adapters can tell "nothing assigned here" from "Weaverse is down" without sniffing internal ids, the Next.js adapter can answer an outage with a retryable error instead of a 404, loader data stops carrying a Weaverse API key, and a route-level project override reports the project it actually loaded.

## Scope & contract

- `loadPage()` loader data (React Router `WeaverseLoaderData`, Next.js `WeaverseNextLoaderData`) gains optional top-level `isFallback?: boolean`. It is `true` only when the SDK synthesizes the placeholder page because the API returned no page; it is absent for real pages (including empty ones) and for synthetic section previews. The placeholder keeps its `fallback_page_*` id, which Studio relies on.
- `createWeaverseNextServerClient` accepts `throwPageLoadFailures?: boolean` (default `false`) with the same semantics as `WeaverseClient`: `loadPage()` rejects with `WeaverseLoadError` whose `kind` is `unavailable` (timeout, network, 408/425/429/5xx), `invalid-response` (error body, non-JSON, or a body that is not a page envelope) or `configuration` (other refusals, missing project id). A 404 still resolves to `null`; an unassigned page still resolves to the placeholder. Without the option, behavior is unchanged.
- `@weaverse/hydrogen/next/server` exports `WeaverseError`, `WeaverseLoadError` and `WeaverseLoadFailureKind`.
- `weaverseApiKey` is removed from `WeaverseProjectConfigs`, `WeaverseHydrogenParams`, `WeaverseStudioQueries`, the `WeaverseHydrogen` runtime and `getWeaverseConfigs()` output. Nothing read it. A `weaverseApiKey` query parameter is stripped from serialized `requestInfo` (`queries`, `search`) on both adapters. `WEAVERSE_API_KEY` stays in `WeaverseEnv` for server-only Content API code.
- React Router `loadPage({ projectId })` returns the effective project id in `configs.projectId`. Section loaders and theme settings keep using the client's default project (documented limit).
- Non-goals: retries and a malformed-200 cache veto for the Next client; async `projectId` for `WeaverseClient`; exporting outline helpers.

## Acceptance

- Unassigned page → `isFallback: true` on both adapters; real page → no `isFallback`.
- Next client with the option: 503 and network failure → `unavailable`; 403 → `configuration`; body without `page` → `invalid-response`; 404 → `null`. Without the option, 503 → `null`.
- A request URL carrying `?weaverseApiKey=` never appears in serialized loader data on either adapter.
- `loadPage({ projectId: 'B' })` on a client defaulting to `A` returns `configs.projectId === 'B'`.
- Release: fixed group 6.4.0, noted as a security fix for the removed field.

## Approach

- Move the page-load classification helpers (`isProjectEnvelope`, `classifyPageLoadFailure`, transport-error normalization) into `packages/hydrogen/src/utils/page-load-failure.ts` and share them between `weaverse-client.ts` and `next/server/server-client.ts`.
- Next fetch errors become `WeaverseError` with `FETCH_ERROR` + status, `TIMEOUT_ERROR`, `NETWORK_ERROR` or `INVALID_RESPONSE`, so the shared classifier applies.
- Package `CHANGELOG.md` files point to the docs changelog, like the root one; release notes stay with the release skill.
- Readme shows the `createAppContext` setup and the `isFallback` / `throwPageLoadFailures` contract; CLI template text names `@weaverse/hydrogen/next`.

## Verification

Unit tests in `packages/hydrogen/__tests__/load-failures.test.ts` and `__tests__/next/next-server.test.tsx` cover each acceptance item; `pnpm run biome`, `typecheck`, `test`, `api:check` (reports regenerated for the intentional API change) and `package:check` pass before push.
