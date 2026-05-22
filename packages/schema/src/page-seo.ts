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
  canonicalUrl?: string
  description?: string
  keywords?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    type?: OpenGraphType
  }
  robots?: {
    index?: boolean
    follow?: boolean
  }
  title?: string
  twitter?: {
    cardType?: TwitterCardType
    title?: string
    description?: string
    image?: string
  }
}

export type OpenGraphType =
  | 'website'
  | 'article'
  | 'product'
  | 'profile'
  | 'video.other'

export type TwitterCardType =
  | 'summary'
  | 'summary_large_image'
  | 'app'
  | 'player'
