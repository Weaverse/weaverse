'use client'

import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import type { WeaverseNextRuntime } from './runtime'
import { WeaverseNextStudioBridge } from './studio-bridge'
import {
  type CreateWeaverseNextStudioInternalsOptions,
  createWeaverseNextStudioInternals,
  type WeaverseNextStudioInternals,
} from './studio-router'

/**
 * Resolve stable Studio `navigate` / `revalidate` callbacks from the Next App
 * Router. `useRouter()` is stable across renders, but the derived callbacks are
 * cached in a ref keyed on the router instance so the bridge's bind effect
 * (which depends on `navigate` / `revalidate` identity) doesn't re-run — and
 * re-`refreshStudio` — on every render.
 */
export function useWeaverseNextStudioInternals(
  options?: CreateWeaverseNextStudioInternalsOptions
): WeaverseNextStudioInternals {
  let router = useRouter()
  let ref = useRef<{
    internals: WeaverseNextStudioInternals
    replace: boolean | undefined
    router: typeof router
  } | null>(null)

  if (
    !ref.current ||
    ref.current.router !== router ||
    ref.current.replace !== options?.replace
  ) {
    ref.current = {
      internals: createWeaverseNextStudioInternals(router, options),
      replace: options?.replace,
      router,
    }
  }

  return ref.current.internals
}

export interface WeaverseNextStudioProps
  extends CreateWeaverseNextStudioInternalsOptions {
  runtime: WeaverseNextRuntime
}

/**
 * Page-level Studio binder wired to the Next App Router. Mirrors Hydrogen's
 * `useStudio` (which binds the runtime and feeds it React Router's `navigate` /
 * `revalidate`): it resolves the App Router callbacks via
 * {@link useWeaverseNextStudioInternals} and hands them to
 * {@link WeaverseNextStudioBridge}, so consuming apps get Studio navigation and
 * revalidation without manually wiring `next/navigation`.
 *
 * Client-only — it is the single place `@weaverse/next` touches
 * `next/navigation`, keeping the runtime/renderer and `@weaverse/next/server`
 * free of router imports.
 */
export function WeaverseNextStudio(props: WeaverseNextStudioProps) {
  let { runtime, replace } = props
  let { navigate, revalidate } = useWeaverseNextStudioInternals({ replace })
  return (
    <WeaverseNextStudioBridge
      navigate={navigate}
      revalidate={revalidate}
      runtime={runtime}
    />
  )
}
