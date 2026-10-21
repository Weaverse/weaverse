# SDK reference generated from TypeDoc

Issue: [#555](https://github.com/Weaverse/weaverse/issues/555) · Docs: [Weaverse/docs#80](https://github.com/Weaverse/docs/issues/80) (phase 3)

## Outcome

docs.weaverse.io renders the `@weaverse/hydrogen` and `@weaverse/next` reference from TypeDoc JSON generated in this repo, so the reference always matches the released code. The hand-written SDK pages in the docs are retired. Their usage examples now live in TSDoc `@example` blocks.

## Scope & contract

- **Artifacts:** `pnpm sdk:reference` (`scripts/sdk-reference.mjs`) writes `sdk-reference/hydrogen.json` and `sdk-reference/next.json`. Both are TypeDoc JSON (`typedoc.json`), and the folder is gitignored.
  - `hydrogen` comes from `packages/hydrogen/src/index.ts`.
  - `next` comes from `packages/next/src/index.ts` (module `main`) and `packages/next/src/server.ts` (module `server`).
- **Re-exports:** `tsconfig.typedoc.json` maps `@weaverse/core`, `@weaverse/react` and `@weaverse/schema` to their sources. Each artifact therefore documents the symbols those packages re-export as they are at the generating commit. There is no separate `@weaverse/schema` reference: both artifacts contain it.
- **Categories:** every exported function, class and variable carries `@category`. The allowed values are `Components`, `Hooks`, `Utilities` and `Schema`. Interfaces and type aliases fall into `Types` (`defaultCategory`). Mintlify turns the categories into the sidebar groups.
- **Delivery:** `.github/workflows/sdk-reference.yml` runs on every published stable release of the fixed group (`vX.Y.Z`), `@weaverse/next` and `@weaverse/schema`, and on manual dispatch. It regenerates both artifacts and opens a PR on Weaverse/docs that updates `sdk-artifacts/`. The PR is reviewed in the Mintlify preview before merge.
  - The workflow needs the `DOCS_REPO_TOKEN` secret: a token with contents and pull-request write access to Weaverse/docs.
- **Blocked by [#547](https://github.com/Weaverse/weaverse/issues/547):** today's entry points export many internal symbols (about 180 in `hydrogen`, 220 in `next`), so the docs would list symbols themes never use. Publish once 6.0 settles the public exports, and generate one artifact per 6.0 entry point (`/react-router`, `/next`, `/next/server`) instead of per package.
- **Non-goals:** CLI, Biome and i18n references, and versioned (5.x/6.x) artifacts; add those when 6.0 ships.

## Acceptance

- `pnpm sdk:reference` finishes without TypeDoc warnings.
- In both artifacts, every function, class and variable has a category other than `Types`.
- The examples from the retired docs pages appear on the matching generated pages.
- A release, or a manual dispatch, opens one PR on Weaverse/docs that only changes `sdk-artifacts/*.json`.

## Approach

TypeDoc reads TypeScript sources directly, so no build is needed. Docs-side wiring (`sdk` groups, removed pages and redirects) lives in Weaverse/docs.

## Verification

- `pnpm sdk:reference`, `pnpm run api:docs:test` and `biome ci .`.
- The docs branch renders the artifacts with `mint dev`.
