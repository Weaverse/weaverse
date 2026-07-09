import type { PageSEOData } from '@weaverse/schema'
import type { WeaverseNextLoaderData, WeaverseNextPageData } from './types'

export interface WeaverseNextSeoMetadata {
  alternates?: { canonical?: string }
  description?: string
  keywords?: string
  openGraph?: {
    description?: string
    images?: string[]
    title?: string
    type?: string
  }
  robots: {
    follow: boolean
    index: boolean
  }
  title?: string
  twitter?: {
    card?: string
    description?: string
    images?: string[]
    title?: string
  }
}

function hasOpenGraphContent(seo: PageSEOData['openGraph']): boolean {
  return Boolean(seo?.title || seo?.description || seo?.image || seo?.type)
}

function hasTwitterContent(seo: PageSEOData['twitter']): boolean {
  return Boolean(seo?.title || seo?.description || seo?.image || seo?.cardType)
}

export function formatWeaverseNextSeoMetadata(
  seo: PageSEOData | null | undefined
): WeaverseNextSeoMetadata {
  let index = seo?.robots?.index !== false
  let follow = seo?.robots?.follow !== false
  let metadata: WeaverseNextSeoMetadata = {
    robots: { index, follow },
  }

  if (!seo) {
    return metadata
  }

  if (seo.title) {
    metadata.title = seo.title
  }
  if (seo.description) {
    metadata.description = seo.description
  }
  if (seo.keywords) {
    metadata.keywords = seo.keywords
  }
  if (seo.canonicalUrl) {
    metadata.alternates = { canonical: seo.canonicalUrl }
  }

  let openGraph = seo.openGraph
  if (hasOpenGraphContent(openGraph)) {
    metadata.openGraph = {
      title: openGraph?.title,
      description: openGraph?.description,
      images: openGraph?.image ? [openGraph.image] : undefined,
      type: openGraph?.type || 'website',
    }
  }

  let twitter = seo.twitter
  if (hasTwitterContent(twitter)) {
    metadata.twitter = {
      card: twitter?.cardType || 'summary',
      title: twitter?.title,
      description: twitter?.description,
      images: twitter?.image ? [twitter.image] : undefined,
    }
  }

  return metadata
}

export function getWeaverseNextSeoMetadata(
  data:
    | WeaverseNextLoaderData
    | WeaverseNextPageData
    | { page?: WeaverseNextPageData | null }
    | null
    | undefined
): WeaverseNextSeoMetadata {
  if (!data) {
    return formatWeaverseNextSeoMetadata(null)
  }
  let page =
    'items' in data && 'id' in data
      ? (data as WeaverseNextPageData)
      : ((data as { page?: WeaverseNextPageData | null }).page ?? null)
  return formatWeaverseNextSeoMetadata(page?.seo ?? null)
}
