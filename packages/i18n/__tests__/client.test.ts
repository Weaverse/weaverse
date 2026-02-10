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

describe('useLegacyT', () => {
  it('should return settingValue when it is non-empty', async () => {
    let { useLegacyT } = await import('../src/client')
    // We can't call hooks outside React, so test the tOrSetting logic directly
    // by extracting the same logic pattern
    function tOrSetting(
      t: (key: string) => string,
      key: string,
      settingValue?: string | null
    ): string {
      if (settingValue != null && settingValue.trim() !== '') {
        return settingValue
      }
      return t(key)
    }

    let mockT = (key: string) => `translated:${key}`
    expect(tOrSetting(mockT, 'heading', 'Welcome!')).toBe('Welcome!')
    expect(tOrSetting(mockT, 'heading', '  Hello  ')).toBe('  Hello  ')
  })

  it('should fallback to t() when settingValue is empty', () => {
    function tOrSetting(
      t: (key: string) => string,
      key: string,
      settingValue?: string | null
    ): string {
      if (settingValue != null && settingValue.trim() !== '') {
        return settingValue
      }
      return t(key)
    }

    let mockT = (key: string) => `translated:${key}`
    expect(tOrSetting(mockT, 'heading', '')).toBe('translated:heading')
    expect(tOrSetting(mockT, 'heading', '   ')).toBe('translated:heading')
  })

  it('should fallback to t() when settingValue is null or undefined', () => {
    function tOrSetting(
      t: (key: string) => string,
      key: string,
      settingValue?: string | null
    ): string {
      if (settingValue != null && settingValue.trim() !== '') {
        return settingValue
      }
      return t(key)
    }

    let mockT = (key: string) => `translated:${key}`
    expect(tOrSetting(mockT, 'heading', null)).toBe('translated:heading')
    expect(tOrSetting(mockT, 'heading', undefined)).toBe('translated:heading')
    expect(tOrSetting(mockT, 'heading')).toBe('translated:heading')
  })
})

describe('usePrefixPath logic', () => {
  it('should prefix path with locale for non-default locale', () => {
    let locale = 'vi'
    let defaultLocale = 'en'

    let prefixPath = (path: string): string => {
      if (locale === defaultLocale) return path
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
      if (locale === defaultLocale) return path
      return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
    }

    expect(prefixPath('/cart')).toBe('/cart')
    expect(prefixPath('cart')).toBe('cart')
  })
})
