import type { WeaverseNextRuntimeInternal } from './types'

/**
 * Minimal structural shape of the Next App Router returned by `useRouter()`
 * (`next/navigation`) that the Studio bridge needs. Declared locally — rather
 * than importing `AppRouterInstance` from `next` — so the adapter stays a pure
 * function that unit tests can drive with a plain mock and never pulls
 * `next/navigation` into the test graph.
 */
export interface WeaverseNextRouterLike {
  /** Add a route to browser history. */
  push: (
    href: string,
    options?: {
      /** Whether to scroll to the top after navigation. */
      scroll?: boolean
    }
  ) => void
  /** Refresh the current App Router route and server data. */
  refresh: () => void
  /** Replace the current browser-history entry. */
  replace: (
    href: string,
    options?: {
      /** Whether to scroll to the top after navigation. */
      scroll?: boolean
    }
  ) => void
}

/** Resolved Studio navigation/revalidation callbacks for a Next runtime. */
export interface WeaverseNextStudioInternals {
  /** Navigate Studio's preview with React Router-compatible options. */
  navigate: NonNullable<WeaverseNextRuntimeInternal['navigate']>
  /** Refresh the current App Router route. */
  revalidate: NonNullable<WeaverseNextRuntimeInternal['revalidate']>
}

/** Controls how Studio navigation maps to the Next App Router. */
export interface CreateWeaverseNextStudioInternalsOptions {
  /** Use `router.replace` instead of `router.push` for navigation. */
  replace?: boolean
}

function shouldResetScroll(
  options?: { preventScrollReset?: boolean } | Record<string, unknown>
): boolean {
  if (!options || typeof options !== 'object') {
    return true
  }
  return !(options as { preventScrollReset?: boolean }).preventScrollReset
}

/**
 * Build Studio `navigate` / `revalidate` callbacks from a Next App Router.
 *
 * Maps Hydrogen's React Router semantics onto Next App Router:
 * - `navigate(to, { preventScrollReset })` → `router.push(to, { scroll })`,
 *   where `scroll` is the inverse of `preventScrollReset`. Studio passes
 *   `preventScrollReset` for in-place edits so the preview viewport is kept,
 *   matching React Router's `navigate({ preventScrollReset })`.
 * - `revalidate()` → `router.refresh()`, the App Router's loader-backed refresh
 *   and the closest equivalent to React Router's `useRevalidator`.
 *
 * Pure (no React, no `next/navigation`) so it is unit-testable with a mock
 * router; the {@link WeaverseNextRouterLike} contract is the only coupling.
 */
export function createWeaverseNextStudioInternals(
  router: WeaverseNextRouterLike,
  options: CreateWeaverseNextStudioInternalsOptions = {}
): WeaverseNextStudioInternals {
  return {
    navigate: (to, navigateOptions) => {
      let scroll = shouldResetScroll(navigateOptions)
      if (options.replace) {
        router.replace(to, { scroll })
      } else {
        router.push(to, { scroll })
      }
    },
    revalidate: () => {
      router.refresh()
    },
  }
}
