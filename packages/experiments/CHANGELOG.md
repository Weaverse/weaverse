# @weaverse/experiments

## 0.1.0

Initial release — framework-agnostic A/B testing and experimentation.

- **Engine (`@weaverse/experiments`)** — zero-dependency, deterministic variant
  assignment via FNV-1a bucketing. `assignVariant`, `resolveExperiments`,
  `stableSeed`, `hashToBucket`. Sticky without storage; weighted splits; per-run
  salt; variant-to-`projectId` mapping for project-level experiments.
- **Server adapter (`@weaverse/experiments/server`)** — `getExperiments(request,
  config)` built on web standards (`Request`/`Headers`/`crypto`). Mints a stable
  `_wv_vid` visitor seed once, resolves assignments, and maps the chosen variant
  to a Weaverse `projectId`. Runs on Hydrogen, Workers, Next.js, Remix, Deno, Bun.
- **React bindings (`@weaverse/experiments/react`)** — `<WeaverseExperiments>`
  provider with fire-once exposure events (bring your own analytics),
  `useExperiment`, `useExperiments`. `react` is an optional peer dependency.
