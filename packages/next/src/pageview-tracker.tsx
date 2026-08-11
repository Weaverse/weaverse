'use client'

import { Suspense } from 'react'
import { type PageviewRuntime, usePageview } from './use-pageview'

function PageviewTracker({ runtime }: { runtime: PageviewRuntime | null }) {
  usePageview(runtime)
  return null
}

/**
 * Invisible pageview tracker, wrapped in an SDK-owned `Suspense` boundary.
 *
 * `usePageview` reads `useSearchParams()`, which opts its subtree into client
 * rendering. Keeping the boundary here — around nothing but the tracker —
 * leaves storefront content statically prerenderable and spares consumers from
 * adding a boundary purely for SDK analytics.
 *
 * Mounted with a runtime by `WeaverseNextRenderer`, and with `null` by
 * `WeaverseNextRootProvider`, which only needs to observe navigations on routes
 * that render no Weaverse page.
 */
export function WeaverseNextPageviewTracker({
  runtime,
}: {
  runtime: PageviewRuntime | null
}) {
  return (
    <Suspense fallback={null}>
      <PageviewTracker runtime={runtime} />
    </Suspense>
  )
}
