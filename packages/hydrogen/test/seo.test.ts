import { describe, expect, it } from 'bun:test'
import type { PageSEOData } from '@weaverse/schema'
import { formatMetaDescriptors, getWeaverseSeoMeta } from '../src/seo'
import type { HydrogenPageData, WeaverseLoaderData } from '../src/types'

const FULL_SEO: PageSEOData = {
  title: 'About Us',
  description: 'We build storefronts.',
  keywords: 'weaverse, hydrogen',
  canonicalUrl: 'https://example.com/about',
  openGraph: {
    title: 'OG Title',
    description: 'OG Desc',
    image: 'https://example.com/og.png',
    type: 'website',
  },
  twitter: {
    cardType: 'summary_large_image',
    title: 'TW Title',
    description: 'TW Desc',
    image: 'https://example.com/tw.png',
  },
  robots: { index: true, follow: true },
}

function findByKey<K extends string>(
  descriptors: ReturnType<typeof formatMetaDescriptors>,
  key: K,
  value: string
) {
  return descriptors.find(
    (d) => typeof d === 'object' && d !== null && (d as any)[key] === value
  ) as any
}

describe('formatMetaDescriptors', () => {
  it('should_emitAllDescriptors_when_fullPayload', () => {
    const out = formatMetaDescriptors(FULL_SEO)

    expect(out).toContainEqual({ title: 'About Us' })
    expect(out).toContainEqual({
      name: 'description',
      content: 'We build storefronts.',
    })
    expect(out).toContainEqual({
      name: 'keywords',
      content: 'weaverse, hydrogen',
    })
    expect(out).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://example.com/about',
    })
    expect(out).toContainEqual({ property: 'og:title', content: 'OG Title' })
    expect(out).toContainEqual({ property: 'og:type', content: 'website' })
    expect(out).toContainEqual({
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    expect(out).toContainEqual({ name: 'robots', content: 'index,follow' })
  })

  it('should_returnRobotsOnly_when_seoIsNull', () => {
    const out = formatMetaDescriptors(null)

    expect(out).toEqual([{ name: 'robots', content: 'index,follow' }])
  })

  it('should_returnRobotsOnly_when_seoIsUndefined', () => {
    const out = formatMetaDescriptors(undefined)

    expect(out).toEqual([{ name: 'robots', content: 'index,follow' }])
  })

  it('should_omitOgDescriptors_when_openGraphIsMissing', () => {
    const out = formatMetaDescriptors({ title: 'X' })

    expect(out.some((d) => 'property' in (d as object))).toBe(false)
  })

  it('should_omitTwitterDescriptors_when_twitterIsMissing', () => {
    const out = formatMetaDescriptors({ title: 'X' })

    expect(
      out.some(
        (d) =>
          typeof d === 'object' &&
          'name' in d &&
          typeof (d as any).name === 'string' &&
          (d as any).name.startsWith('twitter:')
      )
    ).toBe(false)
  })

  it('should_filterEmptyStringFields', () => {
    const out = formatMetaDescriptors({
      title: '',
      description: '',
      keywords: '',
      canonicalUrl: '',
    })

    expect(out.some((d) => 'title' in (d as object))).toBe(false)
    expect(findByKey(out, 'name', 'description')).toBeUndefined()
    expect(findByKey(out, 'name', 'keywords')).toBeUndefined()
    expect(out.some((d) => (d as any).tagName === 'link')).toBe(false)
  })

  it('should_emitNoindexNofollow_when_robotsExplicitlyFalse', () => {
    const out = formatMetaDescriptors({
      robots: { index: false, follow: false },
    })

    expect(out).toContainEqual({
      name: 'robots',
      content: 'noindex,nofollow',
    })
  })

  it('should_emitMixedRobots_when_indexFalseFollowTrue', () => {
    const out = formatMetaDescriptors({
      robots: { index: false, follow: true },
    })

    expect(out).toContainEqual({
      name: 'robots',
      content: 'noindex,follow',
    })
  })

  it('should_defaultOgTypeToWebsite_when_otherOgFieldsPresent', () => {
    const out = formatMetaDescriptors({
      openGraph: { title: 'OG' },
    })

    expect(out).toContainEqual({ property: 'og:type', content: 'website' })
  })

  it('should_defaultTwitterCardToSummary_when_otherTwitterFieldsPresent', () => {
    const out = formatMetaDescriptors({
      twitter: { title: 'TW' },
    })

    expect(out).toContainEqual({ name: 'twitter:card', content: 'summary' })
  })

  it('should_skipOgBlock_when_openGraphObjectIsEmpty', () => {
    const out = formatMetaDescriptors({ openGraph: {} })

    expect(out.some((d) => 'property' in (d as object))).toBe(false)
  })

  it('should_skipTwitterBlock_when_twitterObjectIsEmpty', () => {
    const out = formatMetaDescriptors({ twitter: {} })

    expect(
      out.some(
        (d) =>
          typeof d === 'object' &&
          'name' in d &&
          typeof (d as any).name === 'string' &&
          (d as any).name.startsWith('twitter:')
      )
    ).toBe(false)
  })
})

describe('getWeaverseSeoMeta', () => {
  it('should_pullSeoFromWeaverseLoaderData', () => {
    const data = {
      page: { id: 'p1', name: 'About', items: [], seo: FULL_SEO },
    } as unknown as WeaverseLoaderData

    const out = getWeaverseSeoMeta(data)

    expect(out).toContainEqual({ title: 'About Us' })
  })

  it('should_pullSeoFromHydrogenPageDataDirectly', () => {
    const page: HydrogenPageData = {
      id: 'p1',
      name: 'About',
      items: [],
      seo: { title: 'Direct' },
    } as HydrogenPageData

    const out = getWeaverseSeoMeta(page)

    expect(out).toContainEqual({ title: 'Direct' })
  })

  it('should_returnRobotsDefault_when_dataIsNull', () => {
    const out = getWeaverseSeoMeta(null)

    expect(out).toEqual([{ name: 'robots', content: 'index,follow' }])
  })

  it('should_returnRobotsDefault_when_dataHasNoPage', () => {
    const out = getWeaverseSeoMeta({ page: null })

    expect(out).toEqual([{ name: 'robots', content: 'index,follow' }])
  })

  it('should_returnRobotsDefault_when_pageHasNoSeo', () => {
    const data = {
      page: { id: 'p1', name: 'About', items: [] },
    } as unknown as WeaverseLoaderData

    const out = getWeaverseSeoMeta(data)

    expect(out).toEqual([{ name: 'robots', content: 'index,follow' }])
  })
})
