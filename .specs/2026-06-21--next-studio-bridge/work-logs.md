# Claude/Hermes work log: Issue #2597 Next Studio Bridge E2E

Issue: https://github.com/Weaverse/builder/issues/2597
Branch: `feat/next-studio-bridge-e2e`
Date: 2026-06-23

## Changed files

- `packages/next/src/studio-router.ts`
- `packages/next/src/use-weaverse-next-studio.tsx`
- `packages/next/src/renderer.tsx`
- `packages/next/src/index.ts`
- `packages/next/package.json`
- `packages/next/tsconfig.json`
- `packages/next/vitest.config.ts`
- `packages/next/__tests__/studio-router.test.ts`
- `packages/next/__tests__/__mocks__/next-navigation.ts`
- `.specs/2026-06-21--next-studio-bridge/claude-handoff-issue-2597.md`

## Implementation summary

Claude implemented the first SDK-side Next Studio navigation/revalidation slice:

- Added `createWeaverseNextStudioInternals(router, options)` as a pure adapter from a Next App Router-like object to Studio runtime internals.
- Maps Studio `navigate(to, { preventScrollReset })` to:
  - `router.push(to, { scroll })` by default;
  - `router.replace(to, { scroll })` when `replace: true` is configured;
  - `scroll = false` when `preventScrollReset: true`.
- Maps Studio `revalidate()` to `router.refresh()`.
- Added `useWeaverseNextStudioInternals()` and `WeaverseNextStudio`, a client-only component that calls `useRouter()` from `next/navigation` and feeds callbacks into `WeaverseNextStudioBridge`.
- Updated `WeaverseNextRenderer` to render `WeaverseNextStudio` instead of the raw bridge, so package-level renderer owns Next-native Studio internal wiring.
- Exported the new Studio router helpers and component from `@weaverse/next`.
- Kept `next/navigation` external in tsup and test-mapped it to a local mock because Next is not installed in this monorepo test graph.

Hermes fixed the incomplete Claude pass:

- Fixed Vitest mock typing.
- Applied Biome import ordering.
- Avoided adding `next` as a peer dependency in this slice because regenerating the pnpm lockfile caused unrelated catalog/latest dependency churn. The runtime import remains external and resolves in the consuming Next app.

## Verification results

Passed locally in `Weaverse/weaverse`:

```bash
pnpm --filter @weaverse/next test
# 3 files, 56 tests passed

pnpm --filter @weaverse/next typecheck
# passed

pnpm --filter @weaverse/next build
# passed

pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/package.json --diagnostic-level=error
# passed

git diff --check
# passed
```

Also tested `pnpm install --frozen-lockfile --filter @weaverse/next --ignore-scripts` after removing the peer dependency addition; pnpm reported `Lockfile is up to date` but the command wrapper timed out after pnpm printed `Done`. No lockfile changes are present.

## Remaining risks / manual E2E steps

This is not full Studio E2E yet. Still required:

1. Install/pack this SDK branch into the Next POC.
2. Verify POC build with the new renderer importing `next/navigation`.
3. Mount `WeaverseNextStudioConnect` at the POC root/client shell if it is not already mounted.
4. Open live POC in Studio and verify:
   - bridge script loads;
   - `window.weaverseStudio` exists;
   - `checkWeaversePage()` succeeds;
   - section hover/select works;
   - setting edit updates preview without clobbering drafts;
   - resource-picker changes call `router.refresh()` and server data reloads.

## Builder changes

No Builder change appears necessary for this first slice. The code stays in `@weaverse/next` and maps the framework-specific internals to the existing bridge contract.
