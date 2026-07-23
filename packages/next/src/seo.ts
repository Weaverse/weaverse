import type { PageSEOData } from '@weaverse/schema'
import type { Metadata } from 'next'
import type { WeaverseNextLoaderData, WeaverseNextPageData } from './types'

/** Next's own `openGraph` / `twitter` unions, reused so the helper's result
 * is directly assignable to `Metadata` without a consumer-side adapter. */
type NextOpenGraph = NonNullable<Metadata['openGraph']>
type NextTwitter = NonNullable<Metadata['twitter']>

/**
 * Weaverse page SEO expressed as a subset of Next's `Metadata`. Assignable to
 * `Metadata` as-is: `const metadata: Metadata = getWeaverseNextSeoMetadata(data)`.
 */
export interface WeaverseNextSeoMetadata {
  /** Canonical URL settings for Next's metadata API. */
  alternates?: {
    /** Preferred URL for search indexing. */
    canonical?: string
  }
  /** Page meta description. */
  description?: string
  /** Page meta keywords. */
  keywords?: string
  /** Open Graph metadata normalized to Next's supported union. */
  openGraph?: NextOpenGraph
  /** Search crawler indexing and link-following directives. */
  robots: {
    /** Whether crawlers may follow links on the page. */
    follow: boolean
    /** Whether crawlers may index the page. */
    index: boolean
  }
  /** Page title. */
  title?: string
  /** Twitter card metadata normalized for Next's metadata API. */
  twitter?: NextTwitter
}

function hasOpenGraphContent(seo: PageSEOData['openGraph']): boolean {
  return Boolean(seo?.title || seo?.description || seo?.image || seo?.type)
}

function hasTwitterContent(seo: PageSEOData['twitter']): boolean {
  return Boolean(seo?.title || seo?.description || seo?.image || seo?.cardType)
}

function normalizeTwitterCard(
  cardType: NonNullable<PageSEOData['twitter']>['cardType']
): 'summary' | 'summary_large_image' {
  return cardType === 'summary_large_image' ? 'summary_large_image' : 'summary'
}

/**
 * Map a Builder Open Graph type onto Next's `OpenGraphType` union. Every
 * Builder value except `product` exists in Next's union and is preserved
 * verbatim; `product` is not modeled by Next and makes `generateMetadata()`
 * throw, so it degrades to `website` — the closest renderable equivalent.
 */
function normalizeOpenGraphType(
  type: NonNullable<PageSEOData['openGraph']>['type']
): 'article' | 'profile' | 'video.other' | 'website' {
  if (type === 'article' || type === 'profile' || type === 'video.other') {
    return type
  }
  return 'website'
}

/**
 * Convert Builder SEO fields into metadata accepted by Next.js.
 *
 * Unsupported Open Graph product types and incomplete Twitter app/player
 * cards are safely downgraded to renderable Next.js variants.
 */
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
      type: normalizeOpenGraphType(openGraph?.type),
    }
  }

  let twitter = seo.twitter
  if (hasTwitterContent(twitter)) {
    // Builder does not collect the descriptors Next requires for `app` cards
    // (Next throws when they are missing) or `player` cards (which render an
    // empty, useless card without a player URL and dimensions). Downgrade both
    // to `summary` rather than emitting metadata Next cannot render.
    metadata.twitter = {
      card: normalizeTwitterCard(twitter?.cardType),
      title: twitter?.title,
      description: twitter?.description,
      images: twitter?.image ? [twitter.image] : undefined,
    }
  }

  return metadata
}

/**
 * Read page SEO from loader data or a page payload and format it for Next.js
 * `generateMetadata`. Missing data returns indexable/followable robot defaults.
 */
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
