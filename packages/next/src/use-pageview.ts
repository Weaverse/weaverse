'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { createPageviewCoordinator } from './pageview'

export interface PageviewRuntime {
  isDesignMode?: boolean
  isPreviewMode?: boolean
  isRevisionPreview?: boolean
  pageId?: string
  projectId?: string
  sectionType?: string
  weaverseHost?: string
}

interface PageviewPayload {
  host: string
  pageId: string
  projectId: string
}

let pageviewCoordinator = createPageviewCoordinator()
let pageviewSequence = 0

export function getPageviewNavigationIdentity(
  pathname: string | null,
  searchParams: URLSearchParams | null
): string {
  let normalizedSearchParams = new URLSearchParams(
    searchParams ? searchParams.toString() : ''
  )
  normalizedSearchParams.sort()
  let search = normalizedSearchParams.toString()
  return search ? `${pathname ?? ''}?${search}` : (pathname ?? '')
}

export function getPageviewPayload(
  runtime: PageviewRuntime | null
): PageviewPayload | null {
  if (!runtime) {
    return null
  }
  let { pageId, projectId, weaverseHost } = runtime
  if (
    !(weaverseHost && projectId && pageId) ||
    runtime.isDesignMode ||
    runtime.isPreviewMode ||
    runtime.isRevisionPreview ||
    runtime.sectionType
  ) {
    return null
  }
  return {
    host: weaverseHost,
    pageId,
    projectId,
  }
}

/**
 * Send one pageview via an off-screen `Image`, so the request survives an
 * immediate navigation and can never reject into React.
 *
 * `cacheBust` keeps every fire a distinct URL. Without it the browser serves
 * the previous pixel from its own cache on a revisit or BFCache restore and the
 * view never reaches the server. `@weaverse/hydrogen` still omits it and
 * undercounts those repeats — worth aligning there separately.
 */
export function sendPageview(payload: PageviewPayload): void {
  try {
    let url = new URL('/api/public/px', payload.host)
    url.searchParams.set('projectId', payload.projectId)
    url.searchParams.set('pageId', payload.pageId)
    url.searchParams.set('cacheBust', `${Date.now()}-${pageviewSequence++}`)

    let image = new Image()
    let cleanup = () => {
      image.onload = null
      image.onerror = null
      image.remove()
    }
    image.onload = cleanup
    image.onerror = cleanup
    image.src = url.toString()
  } catch {
    // Pageview transport must never interrupt rendering.
  }
}

export function usePageview(runtime: PageviewRuntime | null): void {
  let pathname = usePathname()
  let searchParams = useSearchParams()
  let navigationIdentity = getPageviewNavigationIdentity(pathname, searchParams)
  // Unpacked into primitives so the effect below can depend on the values
  // rather than a payload object rebuilt on every render.
  let { host, pageId, projectId } = getPageviewPayload(runtime) ?? {}

  useEffect(() => {
    let fire = () => {
      if (
        host &&
        pageId &&
        projectId &&
        pageviewCoordinator.shouldFire(navigationIdentity, pageId)
      ) {
        sendPageview({ host, pageId, projectId })
      }
    }

    pageviewCoordinator.observeNavigation(navigationIdentity)
    fire()

    let handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        return
      }
      pageviewCoordinator.observePageShow(event)
      fire()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [host, navigationIdentity, pageId, projectId])
}
