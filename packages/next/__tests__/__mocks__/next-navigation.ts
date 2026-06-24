/**
 * Repo-local stand-in for `next/navigation`.
 *
 * `next` is a peerDependency of `@weaverse/next` (consuming apps always have it)
 * and is intentionally NOT installed in this monorepo. This shim lets the
 * package typecheck, test, and build without pulling Next into the workspace:
 *
 * - `packages/next/tsconfig.json` `paths` maps `next/navigation` here for `tsc`.
 * - `vitest.config.ts` aliases `next/navigation` here for tests.
 *
 * It never ships: only `dist/*` is published, and the built JS keeps
 * `next/navigation` external so it resolves to the consumer's real Next at
 * runtime.
 */

export interface AppRouterInstance {
  back: () => void
  forward: () => void
  prefetch: (href: string) => void
  push: (href: string, options?: { scroll?: boolean }) => void
  refresh: () => void
  replace: (href: string, options?: { scroll?: boolean }) => void
}

function noop() {
  // Test stub: intentionally no-op.
}

const NOOP_ROUTER: AppRouterInstance = {
  back: noop,
  forward: noop,
  prefetch: noop,
  push: noop,
  refresh: noop,
  replace: noop,
}

let currentRouter: AppRouterInstance = NOOP_ROUTER

/** Test helper: swap the router `useRouter()` returns. Not part of Next's API. */
export function __setMockRouter(router?: Partial<AppRouterInstance> | null) {
  currentRouter = router ? { ...NOOP_ROUTER, ...router } : NOOP_ROUTER
}

export function useRouter(): AppRouterInstance {
  return currentRouter
}
