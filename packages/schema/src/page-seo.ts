/**
 * Page-level SEO metadata, mirroring the nested DTO published by Weaverse
 * Builder (`PageSeo` sidecar) on the public content payload.
 *
 * The authoritative shape lives in `builder/app/schemas/page-seo.ts`
 * (`pageSeoSchema`). This file is a type-only mirror — the SDK trusts the
 * builder payload and does NOT re-validate at runtime. Keep field names
 * in sync; drift here means themes silently lose fields.
 *
 * @see https://github.com/Weaverse/builder — `app/schemas/page-seo.ts`
 */
export interface PageSEOData {
  /** Canonical URL advertised to search engines. */
  canonicalUrl?: string
  /** Search-result description. */
  description?: string
  /** Comma-separated search keywords. */
  keywords?: string
  /** Open Graph metadata used by social platforms. */
  openGraph?: {
    /** Social preview title. */
    title?: string
    /** Social preview description. */
    description?: string
    /** Absolute social preview image URL. */
    image?: string
    /** Open Graph content type. */
    type?: OpenGraphType
  }
  /** Search-engine crawling directives. */
  robots?: {
    /** Whether search engines may index the page. */
    index?: boolean
    /** Whether search engines may follow page links. */
    follow?: boolean
  }
  /** Search-result and browser title. */
  title?: string
  /** X/Twitter card metadata. */
  twitter?: {
    /** Card presentation style. */
    cardType?: TwitterCardType
    /** Card title. */
    title?: string
    /** Card description. */
    description?: string
    /** Absolute card image URL. */
    image?: string
  }
}

/** Open Graph object types supported by Weaverse page metadata. */
export type OpenGraphType =
  | 'website'
  | 'article'
  | 'product'
  | 'profile'
  | 'video.other'

/** X/Twitter card types supported by Weaverse page metadata. */
export type TwitterCardType =
  | 'summary'
  | 'summary_large_image'
  | 'app'
  | 'player'
