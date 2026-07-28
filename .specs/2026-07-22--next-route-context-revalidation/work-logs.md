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
- Initial Claude Code no-tools review found one SDD traceability blocker plus
  table/auth clarifications; all were fixed, then its second pass approved.
- A later source-auditing subagent found five deeper blockers: duplicate-control
  precedence, `PageType` validation, pathname canonicalization, mandatory POC
  tests/exact routes, and an invalid Biome command. All five were corrected.
- Targeted post-fix review returned `APPROVE` with no blockers. The corrected
  Biome command checked 35 SDK files successfully.

## 2026-07-23 — @hta218 (SDK slice implementation)

Implemented the SDK/source/tests/docs slice only. POC and Builder untouched.
All changes left uncommitted for Hermes review.

### Changed files

- `packages/next/src/types.ts` — added optional `handle`/`pageType` to
  `WeaverseNextRequestInfo`.
- `packages/next/src/request-info.ts` — `buildWeaverseNextRequestInfo` now copies
  `context.pageType`/`context.handle` when present (conditional, so existing
  `.toEqual` request-info tests still pass).
- `packages/next/src/revalidate-item.ts` — added
  `WeaverseNextRevalidateRouteContext`, the deny-list constant, the shared
  `sanitizeRouteContextSearch()` and `buildWeaverseNextRevalidateRouteContext()`
  helpers, `requestInfo?` on `RevalidateItemRuntimeLike`, and the sanitized
  `routeContext` in the POST body (omitted when the runtime has no request info).
- `packages/next/src/server/revalidate-handler.ts` — extended `getClient` with an
  optional second `requestContext` argument and the body type with optional
  `routeContext`; added `reconstructRouteContext()` (path-safety validation,
  bounds, `PageTypeSchema`, i18n fail-closed, same-origin URL algorithm,
  last-value Studio controls) and wired the trust-boundary check into `POST`.
- `packages/next/src/index.ts` / `packages/next/src/server.ts` — exported the new
  public type/helper.
- `packages/next/__tests__/next-adapter.test.tsx`,
  `packages/next/__tests__/revalidate-item.test.ts` — added focused TDD tests.
- `packages/next/README.md` — route-handler wiring, one-arg compatibility, and a
  "Trust boundary" section.

### TDD evidence

- Cycle 1 (request-info identity): RED — `should_preserve_page_type_and_handle_in_request_info_when_present`
  failed (`toEqual` diff missing `handle`/`pageType`). GREEN after adding the
  fields + conditional copy: `2 passed`.
- Cycle 2 (client serialization + handler): RED — `8 failed | 9 passed` before
  implementation (missing helper/handler behavior). GREEN after implementing the
  client helper and handler reconstruction: `17 passed`.
- Coverage added: sanitized client POST (denied controls stripped;
  duplicate/encoded ordinary values, mode controls, i18n, pageType, handle
  preserved); legacy omit when runtime has no request info;
  `buildWeaverseNextRevalidateRouteContext` undefined/invalid-pageType; handler
  same-origin PDP reconstruction (`pathname === url.pathname`, origin fixed);
  literal + encoded dot-segment canonicalization into one pathname; duplicate
  Studio controls last-value with `getWeaverseNextConfigs()` cache-mode parity;
  server-side deny-list stripping when client sanitization is bypassed; hostile
  path/search/pageType/i18n/handle inputs → `400 invalid-route-context` (no-store,
  before client creation); spoofed context is routing-only (unknown type still
  404); legacy missing-context passes `undefined`; one-argument `getClient`
  callback compatibility.

### Hermes post-implementation review

- Added explicit hostile-payload regressions for present `routeContext: null`
  and missing required `search`; both failed against the first implementation
  and now return `400 invalid-route-context` before client construction.
- Added a client-side handle bound regression; values above 512 characters are
  omitted before serialization while the server keeps its independent bound.
- Added an adversarial assertion that JSON `headers`, `cookies`, and
  authorization-like fields cannot construct request headers or context fields.

### Verification (SDK gates)

- `pnpm --filter @weaverse/next test` → `Test Files 5 passed (5)`, `Tests 152 passed (152)`.
- `pnpm --filter @weaverse/next typecheck` → clean (`tsc --noEmit`).
- `pnpm --filter @weaverse/next build` → CJS/ESM/DTS build success.
- `pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error`
  → `Checked 35 files`, no errors.
- `git diff --check` → clean.

### Contract note

- No security-contract correction required. Verified in Node that the URL
  `pathname` setter normalizes both literal (`/a/../b`) and percent-encoded
  (`/a/%2e%2e/b`) dot segments to the same canonical value, so the contract's
  "literal and percent-encoded dot segments yield the same canonical value in
  `pathname` and `url.pathname`" holds as written; both context fields receive
  the single `canonicalPathname`.
- The handler control-character path check uses a `biome-ignore
  noControlCharactersInRegex` (intentional rejection of control chars in
  untrusted pathnames).

### Packed POC integration

- Packed the local SDK candidate and overlaid the tarball into the POC's
  `node_modules`; no workspace-only resolution or package manifest change was
  used for behavioral verification.
- POC gates against the packed candidate passed: `npm test` (`19/19`),
  `npm run typecheck`, `npm run lint` (zero errors; five pre-existing image
  warnings), and `npm run build`.
- Local Builder + POC runtime returned `200` for a localized Product,
  Collection, and current published Custom route. The real local
  `/api/weaverse/revalidate` path returned matching public route snapshots for
  all three page types, stripped denied project-selection query controls, and
  returned `400 invalid-route-context` for `routeContext: null`.
- Builder's focused revalidation suite passed `30/30`, including the preferred
  endpoint rejection → route-refresh fallback.
- Restored registry `@weaverse/next@0.1.0-alpha.13` with `npm ci` and verified
  the POC still passes tests, typecheck, lint, and build. The callback's second
  argument is explicitly optional so source stays compatible; alpha.13 uses
  the legacy path until the next SDK prerelease is published and pinned.

### Remaining manual gate

- Local Studio UI redirected to Shopify authentication and browser verification,
  so no in-frame edit, no-remount, scroll-continuity, or stale-draft claim is
  made. Those checks remain required after the POC consumes the new prerelease.

### Delayed independent review corrections

- A synchronous source-aware review initially returned `APPROVE`, but two
  delayed independent source reviews subsequently returned `BLOCK`. The later
  findings superseded the earlier verdict and were resolved before PR creation.
- SDK correction: unknown own i18n keys (nested or string) now fail closed before
  client creation; the package README's server and client examples preserve
  `pageType` / `handle` end to end. Canonical SDK gates pass `153/153` tests,
  typecheck, build, and Biome.
- POC correction: static Hydrogen clients are cached by country/language, the
  real resource query declares market variables with `@inContext`, and a fetch
  capture proves FR route context reaches Shopify as FR/FR rather than US/EN.
  Cache keys are restricted to configured app markets; unsupported untrusted
  pairs fall back to US/EN instead of creating unbounded clients.
- POC correction: the public QA snapshot strictly allowlists only `variant` and
  `sort_by`; OAuth-like `code`, `token`, `access_token`, arbitrary values, and
  server-owned controls are not reflected into loader data. The underlying
  validated request context remains unchanged for real loaders.
- An actual packed-candidate API-route probe verified valid Product/FR callback
  propagation, public snapshot redaction, and `400 invalid-route-context` for an
  unknown nested i18n key.
- Two final synchronous, read-only source reviews inspected the corrected live
  diffs independently and returned `APPROVE` / `APPROVE` with no blockers. Hermes
  separately executed the canonical SDK, registry POC, packed POC, and actual
  route probe gates recorded above.
- A later asynchronous SDK docs review caught that the route-handler snippet
  imported `createWeaverseServerClientFromContext` without defining it in the
  canonical app-helper snippet. The README now defines and exports that explicit
  context path; `getWeaverseServerClient` delegates to it so both initial and
  revalidation flows use the same constructor.
- The SDK branch is ready for a normal PR after these corrections.
- The POC branch must open as draft and remain blocked until the SDK PR merges,
  a new prerelease is published, and `package.json` / `package-lock.json` are
  bumped to that real registry version. Packed tarball contents must never be
  committed as the dependency source.
- After packed verification, `npm ci` restored the POC to the real registry
  alpha.13; registry-mode tests (`19/19`) passed, and package manifests remained
  unchanged.
