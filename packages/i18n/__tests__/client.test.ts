import { describe, expect, it, vi } from 'vitest'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (key: string) => `${ns ? `${ns}:` : ''}${key}`,
    i18n: {
      language: 'vi',
      options: { fallbackLng: 'en' },
    },
  }),
}))

describe('usePrefixPath logic', () => {
  it('should prefix path with locale for non-default locale', () => {
    let locale = 'vi'
    let defaultLocale = 'en'

    let prefixPath = (path: string): string => {
      if (locale === defaultLocale) {
        return path
      }
      let normalizedPath = path.startsWith('/') ? path : `/${path}`
      return `/${locale}${normalizedPath}`
    }

    expect(prefixPath('/cart')).toBe('/vi/cart')
    expect(prefixPath('cart')).toBe('/vi/cart')
    expect(prefixPath('/products/shoes')).toBe('/vi/products/shoes')
  })

  it('should not prefix path for default locale', () => {
    let locale = 'en'
    let defaultLocale = 'en'

    let prefixPath = (path: string): string => {
      if (locale === defaultLocale) {
        return path
      }
      return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
    }

    expect(prefixPath('/cart')).toBe('/cart')
    expect(prefixPath('cart')).toBe('cart')
  })
})
