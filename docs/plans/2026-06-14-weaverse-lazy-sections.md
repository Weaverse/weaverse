# Weaverse lazy-section loading — investigation, measurement & decision

Date: 2026-06-14
Author: paul-phan (with agent)
Status: **Refactor REJECTED + CSS-inline lever TESTED & REVERTED (all measured 2026-06-14).** The lazy-section refactor was dropped after a live bundle measurement refuted its premise (Part B). The one "recommended" follow-up lever (inline CSS) was then implemented, deployed, PSI-measured over 5 runs, found to be a wash, and reverted (Part C). Net: the 4 shipped fixes (Part A) stand; mobile LH >80 is **measured-blocked**.

---

## Part A — What we changed this session (shipped)

### A1. Pilot mobile-performance fixes → PR [Weaverse/pilot#430](https://github.com/Weaverse/pilot/pull/430)
Branch `perf/mobile-lighthouse-lcp` (base `main`). Four fixes, each a real bug, all live-verified on `weaverse.dev`:

| Commit | Fix | Effect |
|---|---|---|
| `1352930a` | Responsive collection images — dropped numeric `width`/`height` (which forced Hydrogen `<Image>` into fixed mode: density `1x` srcset at 1600w + stripped `sizes`). Kept `data`+`sizes`. | LH image waste 865 → 241 KiB (−624 KiB over-fetch) |
| `ad823859` | Hero slideshow renders immediately — added `immediate` prop to `ScrollReveal` (SSR-visible, no IntersectionObserver) for the LCP element. | LCP render-delay 1206 → ~60 ms |
| `9a404f9f` | Hero **text** renders immediately — `RevealImmediateContext` so heading/subheading/paragraph/button/link inside the first slide skip the reveal gate. | — |
| `49d1ac2e` | Newsletter popup gated behind first interaction (`pointerdown`/`keydown`/`touchstart`/`scroll`) instead of a raw `setTimeout` — no interstitial during load. | — |

(Earlier in the session, already on `origin/main`: `07a4e6f6` zod→^5.16.1 bump, `54228580` icon cross-origin sprite fix, `8f747f02` react-player chunk split, `ee207441` slideshow off-screen background defer.)

### A2. OpenClaw Review workflow (pilot)
- The `claude-code-review.yml` workflow was `disabled_manually` → a disabled workflow can't be triggered by **anything** (PR events or dispatch), which is why opening #430 only ran CodeQL. Re-enabled it; it then ran clean (reviewed, no findings). `@codex review` posted → Codex reviewed clean.
- Made it **manually triggerable, manual-only** per decision: added a `workflow_dispatch` trigger with a `pr_number` input and dropped the `pull_request:` trigger (no more auto-run on every PR). Commits `50bf612a`, `b0f8d848` on pilot `main`.
- Run on demand: `gh workflow run claude-code-review.yml --repo Weaverse/pilot -f pr_number=N` (or Actions → Run workflow). `workflow_dispatch` must live on the default branch to appear — hence committed to `main`.

### A3. Mobile Lighthouse — analysis + decision
- **Authoritative** PageSpeed Insights (mobile lab, via the PSI web UI on Google infra — the keyless API quota is exhausted): **Performance 57** (FCP 4.2 s, LCP 6.1 s, SI 7.1 s, TBT 300 ms, CLS 0). **Field/CrUX real-user LCP ≈ 1.1 s — the page is genuinely fast; 57 is the slow-4G + 4× CPU lab artifact.**
- Lab gate (corrects the earlier "JS isn't the bottleneck", which was measured **unthrottled**): **client JS execution dominates** — 15.4 s main-thread, 1.7 s JS eval, 117 KiB unused JS, 6 long tasks. Render-blocking CSS is only 570 ms; TTFB **passes** (uncacheable home is not the gate); SI is the autoplay carousel (gaming-only).
- Max **safe** levers (CSS inline + minor) were thought to move 57 → ~66 — **but the CSS-inline lever was then measured as a wash (Part C1); no safe lever moves it.** >80 needs the lazy-section refactor (measured & rejected, Part B) or gaming SI.
- **Decision (2026-06-14): accept current state + document; keep the 4 wins; do not game SI; do not land the refactor.** The LH goal is documented-as-blocked, not achieved.

---

## Part B — Lazy-section refactor: INVESTIGATED & REJECTED (2026-06-14)

### B0. Verdict — REVERSED after measurement
The earlier "viable, ~57 → 70-75" verdict was written **before the bundle was measured**. A live measurement of the `weaverse.dev` homepage's initial JS **refutes the premise** ("all 80 sections ship and are module-preloaded on the homepage — this is the JS the LH lab penalizes"). The refactor removes ~10% of homepage bytes and ~none of the main-thread cost LH actually gates on → **not worth doing.**

### B1. The measurement (live `weaverse.dev`, authoritative)
Homepage initial JS = **319 KB gzip**, by what lazy-sections could remove:

| Layer | KB gzip | Removable by lazy-sections? |
|---|---:|---|
| Framework — entry.client 56 + chunk-QUQL 39 + react/rolldown-runtime | ~97 | No |
| `weaverse` chunk = SDK runtime **+ all 80 sections' glue** (28/29 section names found inside; 166 KB raw → 42 gz) | 42 | only the off-homepage glue (~25–35 KB max) |
| root route + cart-main | ~28 | No |
| vendor-radix (cart/menu/zoom dialogs — shell) | 46 | No |
| vendor-media = swiper (hero slideshow, eager + LCP) | 33 | No |
| scroll-reveal | 20 | No |
| production = motion | 13 | No |
| vendor-social + swimlane + misc tiny | ~40 | partial |

Three findings:
1. **The largest JS is already split.** dashjs (280) + hls (152) + react-player core (129) = **~560 KB gzip** of media stack is `lazy()` + SSR-stubbed and **absent from the homepage** (confirmed: not in any homepage chunk). The biggest lever is already pulled.
2. **All 80 sections' glue ≈ 42 KB gzip total** — the entire `weaverse` chunk *including* the runtime; heavy deps are already externalized to `vendor-*`. The *removable* off-homepage slice is **~25–35 KB (≈10% of the page)**.
3. **It doesn't touch the LH gate.** Off-homepage sections sit as parsed-but-**unhydrated** dead code (React only hydrates rendered sections). The 15.4 s main-thread / TBT LH penalizes is *hydration* of framework + Weaverse runtime + radix + swiper — all non-removable. Lazy-loading saves ~30 KB download + a little parse, not execution.

### B2. Decision
**Do not pursue the lazy-section refactor.** Net: **~+2–4 LH points (57 → ~60)** — below even this doc's earlier "70–75," nowhere near 80 — bought with a shared-SDK render-path change (per-item `<Suspense>` in `@weaverse/react`, lazy registry in `@weaverse/hydrogen`, React-18 ref risk) rolled across every storefront (80 sections × N themes). The original SDK change-list (per-item Suspense / lazy registry / 80-section schema-Component split + codemod / editor `isDesignMode` re-check) was technically sound but **moot** — the payoff isn't there. It is preserved in this file's git history for the record and not reproduced.

---

## Part C — Next levers (TESTED, mostly negative)

The measured non-removable floor is ~280 KB (88%) of framework + runtime + shell. Only three pieces are reducible without shared-SDK work — and the most promising one was tested and failed.

### C1. Inline the built CSS — **TESTED & REVERTED (no benefit)**
Implemented (`root.tsx`: `./styles/app.css?inline` + a `<style>` tag instead of the `?url` external link), built, and **deployed to prod**. Verified live: the 127 KB / 21 KB-gzip Tailwind output moved from a render-blocking `<link rel=stylesheet>` into a single inline `<style>` (no `app-*.css` linked; the home response grew 544 → 672 KB).

**Authoritative PSI mobile — 5 fresh runs:** Perf `64, 56, 61, 56, 52` → **median 56 / FCP 4.3 s** vs the **57 / 4.2 s baseline**. **No measurable gain** (within run-to-run noise).

Why it's a wash: on simulated slow-4G the 21 KB just **relocates into the render-blocking HTML document**, so the saved CSS round-trip is offset by a heavier critical-path payload. It also *costs* — +21 KB on every uncacheable-home response, and FPC-cached pages lose cross-page CSS caching (a returning/multi-page visitor re-downloads the CSS per hard navigation instead of reusing one cached file). **Reverted** (prod back to `49d1ac2e`). Lesson: LH's "eliminate render-blocking CSS (~570 ms)" estimate does **not** materialize when you inline same-size bytes into the critical HTML on a throttled link — measure before believing the audit's projected savings.

### C2. Split `vendor-radix` by surface — *untested, expected marginal*
The 46 KB `vendor-radix` chunk bundles shell primitives (`dialog`/`dropdown`/`tooltip` — needed on home) **with** collection-filter / product-option primitives (`checkbox`/`slider`/`select`/`accordion`/`navigation-menu`/`collapsible` — only on PLP/PDP). Splitting via vite `manualChunks` drops ~15–25 KB off the homepage. Cheap + safe, but **download+parse only** (never hydrated on home) → expected to **not** move TBT/main-thread. Given C1's null result, not worth deploying without first proving a delta on a held-out measurement.

### C3. Non-levers
- **Swiper (33 KB):** hero slideshow = LCP element + autoplay feature → removable only by a CSS-scroll-snap rewrite (real UX/feature risk). Skip.
- **Weaverse runtime (42 KB) / framework (97 KB):** irreducible without shared-SDK work or dropping React 19 / RR7. Out of scope.

### C4. Honest ceiling — CONFIRMED by measurement
The only "recommended" safe lever (C1) measured as a wash; C2 is download-parse-only. **No safe code lever moves pilot mobile LH off ~57.** >80 remains blocked. Real-user perf is already good (CrUX LCP ≈ 1.1 s), so this is the correct stopping point — the 4 shipped fixes (A1) stand and further LH chasing is not worth it.
