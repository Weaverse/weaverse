# SDK reference generated from TypeDoc

Issue: [#555](https://github.com/Weaverse/weaverse/issues/555) · Docs: [Weaverse/docs#80](https://github.com/Weaverse/docs/issues/80) (phase 3)

## Outcome

docs.weaverse.io renders the `@weaverse/hydrogen` 6.x reference from TypeDoc JSON generated in this repo, one artifact per framework adapter, so the reference always matches the released code. The hand-written SDK pages in the docs are retired. Their usage examples and notes now live in TSDoc.

## Scope & contract

- **Artifacts:** `pnpm sdk:reference` (`scripts/sdk-reference.mjs`) writes TypeDoc JSON (`typedoc.json`) to `sdk-reference/` (gitignored):
  - `react-router.json` from `packages/hydrogen/src/react-router.ts` (`@weaverse/hydrogen/react-router`).
  - `next.json` from `packages/hydrogen/src/next.ts` (module `next`, `@weaverse/hydrogen/next`) and `packages/hydrogen/src/next-server.ts` (module `next-server`, `@weaverse/hydrogen/next/server`).
- **Entry points:** one artifact per framework, not per entry point. Each adapter entry re-exports the core (`@weaverse/hydrogen`) and the React bindings (`/react`), and themes import only from their adapter entry, so separate core and `/react` artifacts would duplicate the same pages in the docs. `/internal` is never documented; the 6.x API reports mark nothing `@internal`, and `excludeInternal` drops any future `@internal` symbol.
- **Re-exports:** `tsconfig.typedoc.json` maps `@weaverse/core`, `@weaverse/react` and `@weaverse/schema` to their sources, so each artifact documents the symbols the entry re-exports as they are at the generating commit. There is no separate `@weaverse/schema` reference.
- **Categories:** every exported function, class and variable of the documented entries carries `@category`. The allowed values are `Components`, `Hooks`, `Utilities` and `Schema`. Interfaces and type aliases fall into `Types` (`defaultCategory`). Mintlify turns the categories into the sidebar groups.
- **Delivery:** `.github/workflows/sdk-reference.yml` runs on every published stable release of the fixed group (`vX.Y.Z`, which ships both adapters) and `@weaverse/schema`, and on manual dispatch. It regenerates both artifacts and opens a PR on Weaverse/docs that updates `sdk-artifacts/`. The PR is reviewed in the Mintlify preview before merge.
  - The workflow needs the `DOCS_REPO_TOKEN` secret: a token with contents and pull-request write access to Weaverse/docs. It is not configured yet.
- **Non-goals:** CLI, i18n, experiments and `/internal` references, a standalone `@weaverse/schema` reference, and versioned (5.x/6.x) artifacts.

## Acceptance

- `pnpm sdk:reference` finishes without TypeDoc warnings.
- In both artifacts, every function, class and variable has a category other than `Types`.
- The examples and notes from the retired docs pages, including their SDK 6 updates, appear on the matching generated pages.
- A release, or a manual dispatch, opens one PR on Weaverse/docs that only changes `sdk-artifacts/*.json`.

## Approach

TypeDoc reads TypeScript sources directly, so no build is needed. Docs-side wiring (`sdk` groups, removed pages and redirects) lives in Weaverse/docs.

## Verification

- `pnpm sdk:reference`, `pnpm run ci`, `pnpm run typecheck` and `pnpm run api:check`.
- The docs branch renders the artifacts with `mint dev`.
