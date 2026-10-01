'use client'

import { useEffect } from 'react'
import { resolveWeaverseNextStudioScriptSrc } from './studio-script-src'
import type { WeaverseNextRequestContext } from './types'

const loadedScriptSrcs = new Set<string>()

function loadScript(src: string) {
  if (typeof document === 'undefined') {
    return
  }

  if (loadedScriptSrcs.has(src)) {
    return
  }

  let existing = document.querySelector(`script[src="${src}"]`)
  if (existing) {
    loadedScriptSrcs.add(src)
    return
  }

  let script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
  loadedScriptSrcs.add(src)
}

/** Trust context used while loading the Studio bridge script. */
export interface LoadWeaverseNextStudioScriptOptions {
  /** Storefront hostname; required to permit loopback Studio origins. */
  storefrontHostname?: string
}

/**
 * Resolve and append the Next Studio bridge script for the given request
 * context, deduping by src. SSR-safe (no-op without `document`) so it can run
 * unconditionally from a root layout/error boundary before any page tree or
 * runtime exists — e.g. App Router `not-found.tsx` / `error.tsx` routes.
 */
export function loadWeaverseNextStudioScript(
  context?: WeaverseNextRequestContext,
  options: LoadWeaverseNextStudioScriptOptions = {}
) {
  let resolvedContext = context
  if (!resolvedContext && typeof window !== 'undefined') {
    resolvedContext = {
      searchParams: new URLSearchParams(window.location.search),
      url: window.location.href,
    }
  }

  let src = resolveWeaverseNextStudioScriptSrc(resolvedContext, {
    storefrontHostname:
      options.storefrontHostname ??
      (typeof window === 'undefined' ? undefined : window.location.hostname),
  })
  if (src) {
    loadScript(src)
  }
}

/** Props for the root-level Studio script connector. */
export interface WeaverseNextStudioConnectProps {
  /** Explicit request context used to resolve Studio mode and host. */
  context?: WeaverseNextRequestContext
  /** Storefront hostname; required to permit loopback Studio origins. */
  storefrontHostname?: string
}

/**
 * Root-level Studio script connector for Next client boundaries. Mount once
 * near the app root (e.g. root layout) so it also covers routes that never
 * render `WeaverseNextRenderer`, such as `not-found.tsx` / `error.tsx`.
 */
export function WeaverseNextStudioConnect(
  props: WeaverseNextStudioConnectProps
) {
  useEffect(() => {
    loadWeaverseNextStudioScript(props.context, {
      storefrontHostname: props.storefrontHostname,
    })
  }, [props.context, props.storefrontHostname])

  return null
}
