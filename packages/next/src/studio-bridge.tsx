'use client'

import { useEffect, useRef } from 'react'
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
  revalidateItem?: WeaverseNextRuntimeInternal['revalidateItem']
  runtime: WeaverseNextRuntime
}

/** Page-level Studio runtime binder. */
export function WeaverseNextStudioBridge(props: WeaverseNextStudioBridgeProps) {
  let { runtime, navigate, revalidate, revalidateItem } = props
  let lastRuntimeRef = useRef(runtime)
  let lastRuntimeDataRef = useRef(runtime.data)
  let lastRequestInfoRef = useRef(runtime.requestInfo)

  useEffect(() => {
    if (navigate) {
      runtime.internal.navigate = navigate
    }
    if (revalidate) {
      runtime.internal.revalidate = revalidate
    }
    if (revalidateItem) {
      runtime.internal.revalidateItem = revalidateItem
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
  }, [runtime, navigate, revalidate, revalidateItem])

  useEffect(() => {
    if (lastRuntimeRef.current !== runtime) {
      lastRuntimeRef.current = runtime
      lastRuntimeDataRef.current = runtime.data
      lastRequestInfoRef.current = runtime.requestInfo
      return
    }

    if (
      lastRuntimeDataRef.current === runtime.data &&
      lastRequestInfoRef.current === runtime.requestInfo
    ) {
      return
    }

    lastRuntimeDataRef.current = runtime.data
    lastRequestInfoRef.current = runtime.requestInfo
    bindWeaverseNextStudioRuntime(runtime)
  }, [runtime, runtime.data, runtime.requestInfo])

  return null
}
