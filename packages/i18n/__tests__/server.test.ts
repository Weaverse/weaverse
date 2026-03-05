import { describe, expect, it } from 'bun:test'
import { WeaverseI18nServer } from '../src/server'

let defaultConfig = {
  projectId: 'test-project',
  supportedLngs: ['en', 'vi', 'fr'],
  fallbackLng: 'en',
  defaultNS: 'common',
}

describe('WeaverseI18nServer', () => {
  describe('constructor', () => {
    it('should throw when no projectId and no custom apiUrl', () => {
      expect(
        () =>
          new WeaverseI18nServer({
            supportedLngs: ['en'],
            fallbackLng: 'en',
            defaultNS: 'common',
          } as any)
      ).toThrow('`projectId` is required')
    })

    it('should not throw when projectId is provided', () => {
      expect(() => new WeaverseI18nServer(defaultConfig)).not.toThrow()
    })

    it('should not throw when custom apiUrl is provided without projectId', () => {
      expect(
        () =>
          new WeaverseI18nServer({
            supportedLngs: ['en'],
            fallbackLng: 'en',
            defaultNS: 'common',
            apiUrl: 'https://custom.api/{{lng}}/{{ns}}.json',
          } as any)
      ).not.toThrow()
    })
  })

  describe('getLocale', () => {
    it('should extract locale from URL path prefix', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/vi/products')
      expect(server.getLocale(request)).toBe('vi')
    })

    it('should return fallback when path prefix is not a supported locale', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/products')
      expect(server.getLocale(request)).toBe('en')
    })

    it('should match base language from URL path prefix (e.g. vi-us → vi)', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/vi-us/cart')
      expect(server.getLocale(request)).toBe('vi')
    })

    it('should match base language from URL path prefix (e.g. fr-ca → fr)', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/fr-ca/products')
      expect(server.getLocale(request)).toBe('fr')
    })

    it('should extract locale from cookie', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/products', {
        headers: { Cookie: 'session=abc; lng=fr; theme=dark' },
      })
      expect(server.getLocale(request)).toBe('fr')
    })

    it('should prefer URL path over cookie', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/vi/products', {
        headers: { Cookie: 'lng=fr' },
      })
      expect(server.getLocale(request)).toBe('vi')
    })

    it('should extract locale from Accept-Language header', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/products', {
        headers: { 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8' },
      })
      expect(server.getLocale(request)).toBe('fr')
    })

    it('should handle Accept-Language with base language matching', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/products', {
        headers: { 'Accept-Language': 'vi-VN,vi;q=0.9' },
      })
      expect(server.getLocale(request)).toBe('vi')
    })

    it('should handle Accept-Language with malformed quality values', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/products', {
        headers: { 'Accept-Language': 'vi;q=abc,en;q=0.9' },
      })
      // vi gets q=0 (NaN → 0), en gets q=0.9, so en wins
      expect(server.getLocale(request)).toBe('en')
    })

    it('should return fallback when no locale is detected', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/products', {
        headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
      })
      expect(server.getLocale(request)).toBe('en')
    })

    it('should handle root URL path', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/')
      expect(server.getLocale(request)).toBe('en')
    })

    it('should handle empty Accept-Language gracefully', () => {
      let server = new WeaverseI18nServer(defaultConfig)
      let request = new Request('https://example.com/')
      expect(server.getLocale(request)).toBe('en')
    })
  })
})
