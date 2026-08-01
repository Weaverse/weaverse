'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { createPageviewCoordinator } from './pageview'

interface PageviewRuntime {
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

interface SearchParamsValue {
  toString: () => string
}

let pageviewCoordinator = createPageviewCoordinator()

export function getPageviewNavigationIdentity(
  pathname: string | null,
  searchParams: SearchParamsValue | null
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

export function sendPageview(payload: PageviewPayload): void {
  try {
    let url = new URL('/api/public/px', payload.host)
    url.searchParams.set('projectId', payload.projectId)
    url.searchParams.set('pageId', payload.pageId)

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
  let payload = getPageviewPayload(runtime)
  let host = payload?.host
  let pageId = payload?.pageId
  let projectId = payload?.projectId

  useEffect(() => {
    pageviewCoordinator.observeNavigation(navigationIdentity)
    if (
      host &&
      pageId &&
      projectId &&
      pageviewCoordinator.shouldFire(navigationIdentity, pageId)
    ) {
      sendPageview({ host, pageId, projectId })
    }
  }, [host, navigationIdentity, pageId, projectId])
}
