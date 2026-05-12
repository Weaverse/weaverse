import type { PageSEOData } from '@weaverse/schema'
import type { MetaDescriptor } from 'react-router'
import type { HydrogenPageData, WeaverseLoaderData } from './types'

/**
 * Convert a Weaverse page-level SEO payload into React Router
 * `MetaDescriptor[]`. Pure, synchronous, tree-shakeable — does not fetch.
 *
 * Behavior:
 * - `title` → top-level `{ title }` descriptor.
 * - `description` / `keywords` → `<meta name="...">`.
 * - `canonicalUrl` → `<link rel="canonical">`.
 * - `openGraph.*` → `<meta property="og:*">`. `og:type` defaults to
 *   `'website'` when any other OG field is present.
 * - `twitter.*` → `<meta name="twitter:*">`. `twitter:card` defaults to
 *   `'summary'` when any other Twitter field is present.
 * - `robots` is always emitted (defaults to `'index,follow'`) so themes
 *   stacking multiple SEO sources have a deterministic last word on
 *   indexing for Weaverse-managed pages.
 * - Empty strings / missing fields are filtered before return so empty
 *   descriptors don't override earlier sources (e.g. Hydrogen
 *   `getSeoMeta`).
 */
export function formatMetaDescriptors(
  seo: PageSEOData | null | undefined
): MetaDescriptor[] {
  if (!seo) {
    return [{ name: 'robots', content: 'index,follow' }]
  }

  let descriptors: MetaDescriptor[] = []

  if (seo.title) {
    descriptors.push({ title: seo.title })
  }
  if (seo.description) {
    descriptors.push({ name: 'description', content: seo.description })
  }
  if (seo.keywords) {
    descriptors.push({ name: 'keywords', content: seo.keywords })
  }
  if (seo.canonicalUrl) {
    descriptors.push({
      tagName: 'link',
      rel: 'canonical',
      href: seo.canonicalUrl,
    })
  }

  let og = seo.openGraph
  if (og && (og.title || og.description || og.image || og.type)) {
    if (og.title) {
      descriptors.push({ property: 'og:title', content: og.title })
    }
    if (og.description) {
      descriptors.push({ property: 'og:description', content: og.description })
    }
    if (og.image) {
      descriptors.push({ property: 'og:image', content: og.image })
    }
    descriptors.push({ property: 'og:type', content: og.type || 'website' })
  }

  let tw = seo.twitter
  if (tw && (tw.title || tw.description || tw.image || tw.cardType)) {
    descriptors.push({
      name: 'twitter:card',
      content: tw.cardType || 'summary',
    })
    if (tw.title) {
      descriptors.push({ name: 'twitter:title', content: tw.title })
    }
    if (tw.description) {
      descriptors.push({ name: 'twitter:description', content: tw.description })
    }
    if (tw.image) {
      descriptors.push({ name: 'twitter:image', content: tw.image })
    }
  }

  let index = seo.robots?.index !== false
  let follow = seo.robots?.follow !== false
  descriptors.push({
    name: 'robots',
    content: `${index ? 'index' : 'noindex'},${follow ? 'follow' : 'nofollow'}`,
  })

  return descriptors
}

/**
 * Convenience accessor: pull `page.seo` out of a `WeaverseLoaderData`
 * (or `HydrogenPageData`) and emit `MetaDescriptor[]`. Null-safe.
 *
 * @example
 * ```ts
 * export const meta: MetaFunction<typeof loader> = ({ data }) => {
 *   return getWeaverseSeoMeta(data?.weaverseData)
 * }
 * ```
 */
export function getWeaverseSeoMeta(
  data:
    | WeaverseLoaderData
    | HydrogenPageData
    | { page?: HydrogenPageData | null }
    | null
    | undefined
): MetaDescriptor[] {
  if (!data) {
    return formatMetaDescriptors(null)
  }
  let page =
    'items' in data && 'id' in data
      ? (data as HydrogenPageData)
      : ((data as { page?: HydrogenPageData | null }).page ?? null)
  return formatMetaDescriptors(page?.seo ?? null)
}
