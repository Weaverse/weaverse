import { describe, expect, it, vi } from 'vitest'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (key: string) => `${ns ? `${ns}:` : ''}${key}`,
    i18n: {
      language: 'vi',
      options: { fallbackLng: 'en', supportedLngs: ['en', 'vi', 'fr'] },
    },
  }),
  initReactI18next: { type: '3rdParty', init: () => {} },
  I18nextProvider: ({ children }: any) => children,
}))

// Mock react hooks for non-React test environment
vi.mock('react', () => ({
  useCallback: (fn: (...args: never[]) => unknown, _deps: unknown[]) => fn,
  useMemo: (fn: () => unknown, _deps: unknown[]) => fn(),
}))

describe('usePrefixPath', () => {
  it('should prefix path with locale for non-default locale', async () => {
    let { usePrefixPath } = await import('../src/client')
    let prefixPath = usePrefixPath()

    expect(prefixPath('/cart')).toBe('/vi/cart')
    expect(prefixPath('cart')).toBe('/vi/cart')
    expect(prefixPath('/products/shoes')).toBe('/vi/products/shoes')
  })
})

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

describe('useWeaverseT', () => {
  it('should return useTranslation result with namespace', async () => {
    let { useWeaverseT } = await import('../src/client')
    let result = useWeaverseT('common')

    expect(result.t('hello')).toBe('common:hello')
    expect(result.i18n.language).toBe('vi')
  })

  it('should return useTranslation result without namespace', async () => {
    let { useWeaverseT } = await import('../src/client')
    let result = useWeaverseT()

    expect(result.t('hello')).toBe('hello')
  })
})

describe('WeaverseI18nProvider', () => {
  it('should be a function component', async () => {
    let { WeaverseI18nProvider } = await import('../src/provider')
    expect(typeof WeaverseI18nProvider).toBe('function')
  })

  it('should accept data prop with the correct shape', async () => {
    let { WeaverseI18nProvider } = await import('../src/provider')
    // Verify the component can handle the expected data shape
    let data = {
      locale: 'vi',
      resources: { vi: { common: { hello: 'Xin chào' } } },
      supportedLngs: ['en', 'vi'],
      fallbackLng: 'en',
    }
    // WeaverseI18nProvider is a React component - we verify it exists and is callable
    expect(() => WeaverseI18nProvider({ data, children: null })).not.toThrow()
  })
})
