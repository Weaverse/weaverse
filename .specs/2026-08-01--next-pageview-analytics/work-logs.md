# Work Logs

## 2026-08-01 — @hta218

- Audited Builder #2738 and the existing Hydrogen pageview implementation in `packages/hydrogen/src/utils/pixel.ts` and `use-studio.ts`.
- Confirmed Next ownership: the SDK already owns runtime/project/page identities and mode flags; placing the Weaverse pixel in a starter would duplicate protocol and lifecycle logic.
- Confirmed Next cannot copy Hydrogen's React Router `location.key`; the design uses App Router pathname/search observation plus mounted-instance lifecycle state.
- Confirmed the primary SDK checkout is `/Users/hta218/Documents/work/workspace/weaverse`, clean on current `origin/main`; removed the obsolete auxiliary `main` worktree before creating `feat/next-pageview-analytics` in the primary checkout.
- Scope remains `@weaverse/next` only. No Builder, Hydrogen, starter, generic vendor analytics, or public configuration work.
- Claude Code implementation could not start because the configured account had reached its monthly spend limit; it produced no diff.
- Codex produced the RED tests, then the coordinator/hook/renderer implementation. Its in-agent Vite+ commands hung in the PTY and were interrupted; Hermes reran every command directly instead of accepting the agent report.
- TDD RED was reproduced with the canonical root command: the focused suite failed because `src/pageview.ts` and `src/use-pageview.ts` did not exist and the renderer never called the hook.
- GREEN added a private coordinator, private App Router hook, renderer integration, and navigation-hook test mocks. Hermes removed leaking Image globals and Biome-invalid constructor stubs before final verification.
- Copilot autoreview reached the model but the wrapper failed on known NDJSON `Extra data`; an isolated source-grounded reviewer was dispatched as the replacement review gate.

### Verification

| Command | Result |
| --- | --- |
| `pnpm exec vp test --run packages/next/__tests__/pageview.test.ts packages/next/__tests__/pageview-renderer.test.tsx` | RED: 2 failed files before source; GREEN: 2 files / 16 tests passed |
| `pnpm --filter @weaverse/next test` | 7 files / 172 tests passed |
| `pnpm --filter @weaverse/next typecheck` | passed |
| `pnpm exec biome check packages/next/src packages/next/__tests__ --diagnostic-level=error` | 39 files checked, no errors |
| `pnpm --filter @weaverse/next build` | passed |
| `pnpm run package:check` | 8 packed packages and 10 TypeScript entrypoints verified |
| `pnpm run test` | 8 tasks successful |
| `pnpm run typecheck` | 6 tasks successful |
| `pnpm run biome` | 149 files checked, no errors |
| Packed candidate in disposable POC: `npm run typecheck`, `npm run lint`, `npm run build` | passed; lint reported 5 existing image warnings and 0 errors; all existing POC routes are dynamic, so this did not cover static prerendering |
| Minimal static Next 16.2.9 consumer probe | pre-fix failed with `missing-suspense-with-csr-bailout`; post-fix prerendered `○ /` and wrote `/` to `prerender-manifest.json` |
| `git diff --check` | passed |

### Review finding and fix

- The first isolated reviewer found one blocker: unconditional `useSearchParams()` in `WeaverseNextRenderer` required every static consumer route to add a Suspense boundary, but the documented renderer usage did not require one.
- Hermes reproduced it with the packed candidate in a minimal Next 16.2.9 static route. The production build failed with `missing-suspense-with-csr-bailout`.
- The SDK now renders only the invisible tracker inside a narrow internal `Suspense` boundary. `WeaverseRoot` and `WeaverseNextStudio` remain outside the boundary, so storefront content is not hidden or converted into a CSR bailout.
- `pageview-renderer.test.tsx` now asserts the React server Suspense marker. The repacked candidate successfully prerendered `/` as static content (`○ /`), with `.next/prerender-manifest.json` confirming the route.
- `package:check` then detected an inferred return-type narrowing on the public renderer. An explicit `JSX.Element | null` annotation using `react/jsx-runtime` preserves the existing API report; direct build plus `scripts/api-reports.mjs` now pass with no report diff.
- A fresh post-fix source-grounded reviewer was dispatched after these changes.
- That reviewer verified the Suspense fix, packed static output, public API report, release dry-runs, and all gates, then found one remaining blocker: clearing dedupe state on the deferred last-unmount reset made a same-navigation remount eligible again after one microtask (`initial true`, `same-navigation-remount-after-microtask true`).
- The coordinator no longer models renderer registration or unmount reset. It retains the fired page set across renderer lifetimes and clears it only when it observes a different normalized navigation identity. The focused regression now awaits a microtask before asserting the same page remains ineligible.
- The resulting focused suite passes 2 files / 14 tests; Next typecheck and scoped Biome pass.
- Final independent review verdict: `APPROVE`, with no blocking findings. Its only non-blocking note was the stale registration sentence in `plan.md`; that sentence was corrected to match navigation-owned dedupe.
- Final gates pass on the lifecycle redesign: repository tests (Next 7 files / 170 tests), repository typecheck, repository Biome (149 files), `package:check` (8 packed packages / 10 TypeScript entrypoints), Next pack dry-run, npm alpha publish dry-run, and `git diff --check`.
- The exact final tarball was installed into the disposable Next 16.2.9 fixture. Production build prerendered `/` as `○ (Static)` with build ID `psMm77dCB2G7hSzHL96c8`; the installed bundle contains `/api/public/px`.

## 2026-08-12 — Superseded

- Billing ownership moved to successful Builder server API requests.
- Removed the private Hydrogen and Next `/api/public/px` emitters and their lifecycle-only helpers.
- Added package-level source invariants so browser billing transport cannot return unnoticed.

## 2026-08-12 — Corrected server-meter contract

- Restored the frozen compatibility boundary: legacy SDK releases keep `/px`; only the new release removes it.
- New Hydrogen and Next page-project requests send `X-Weaverse-Usage-Source: project-request-v1` only outside design, preview, and revision modes.
- Replaced source-text invariants with behavioral request-header regressions.
- Coordinated release order is Builder, Queue resources/consumer, API worker producer, then SDK packages.
- Reliability review replaced the proposed Durable Object flush with awaited Cloudflare Queue delivery, an edge usage worker consumer, and transactional Builder receipts. SDK marker behavior is unchanged.
