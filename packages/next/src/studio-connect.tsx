'use client'

import { useEffect } from 'react'
import type { WeaverseNextStudioFramework } from './studio-script-src'
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

export interface WeaverseNextStudioConnectProps {
  context?: WeaverseNextRequestContext
  /**
   * Studio bridge framework path to load. Defaults to `hydrogen` for one alpha
   * migration cycle; pass `next` after Builder serves `/static/studio/next/*`.
   */
  framework?: WeaverseNextStudioFramework
  storefrontHostname?: string
}

/** Root-level Studio script connector for Next client boundaries. */
export function WeaverseNextStudioConnect(
  props: WeaverseNextStudioConnectProps
) {
  useEffect(() => {
    let context = props.context
    if (!context && typeof window !== 'undefined') {
      context = {
        searchParams: new URLSearchParams(window.location.search),
        url: window.location.href,
      }
    }

    let src = resolveWeaverseNextStudioScriptSrc(context, {
      framework: props.framework,
      storefrontHostname:
        props.storefrontHostname ??
        (typeof window === 'undefined' ? undefined : window.location.hostname),
    })
    if (src) {
      loadScript(src)
    }
  }, [props.context, props.framework, props.storefrontHostname])

  return null
}
