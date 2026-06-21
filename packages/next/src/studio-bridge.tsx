'use client'

import { useEffect } from 'react'
import {
  bindWeaverseNextStudioRuntime,
  type WeaverseNextRuntime,
} from './runtime'
import type { WeaverseNextRuntimeInternal } from './types'

const STUDIO_BIND_RETRY_INTERVAL_MS = 50
const STUDIO_BIND_MAX_ATTEMPTS = 100

export interface WeaverseNextStudioBridgeProps {
  navigate?: WeaverseNextRuntimeInternal['navigate']
  revalidate?: WeaverseNextRuntimeInternal['revalidate']
  runtime: WeaverseNextRuntime
}

/** Page-level Studio runtime binder. */
export function WeaverseNextStudioBridge(props: WeaverseNextStudioBridgeProps) {
  let { runtime, navigate, revalidate } = props

  useEffect(() => {
    if (navigate) {
      runtime.internal.navigate = navigate
    }
    if (revalidate) {
      runtime.internal.revalidate = revalidate
    }

    if (bindWeaverseNextStudioRuntime(runtime) || !runtime.isDesignMode) {
      return
    }

    let attempts = 0
    let interval = window.setInterval(() => {
      attempts += 1
      if (
        bindWeaverseNextStudioRuntime(runtime) ||
        attempts >= STUDIO_BIND_MAX_ATTEMPTS
      ) {
        window.clearInterval(interval)
      }
    }, STUDIO_BIND_RETRY_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [runtime, navigate, revalidate])

  return null
}
