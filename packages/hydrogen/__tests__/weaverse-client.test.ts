import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { HydrogenComponent, HydrogenThemeSchema } from '../src/types'
import { WeaverseClient } from '../src/weaverse-client'

describe('WeaverseClient Multi-Project Architecture', () => {
  let mockComponents: HydrogenComponent[]
  let mockThemeSchema: HydrogenThemeSchema
  let mockContext: any
  let consoleWarnSpy: any
  let consoleErrorSpy: any

  beforeEach(() => {
    mockComponents = []
    mockThemeSchema = {
      info: {
        name: 'Test Theme',
        author: 'Test Author',
        version: '1.0.0',
        authorProfilePhoto: '',
        documentationUrl: '',
        supportUrl: '',
      },
      settings: [],
    }

    mockContext = createMockContext()

    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('T025: Backward Compatibility with Static String', () => {
    it('should accept static string projectId (existing behavior)', () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'static-project-123',
      })

      expect(weaverse.configs.projectId).toBe('static-project-123')
    })

    it('should trim whitespace from static string projectId', () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: '  static-project-456  ',
      })

      expect(weaverse.configs.projectId).toBe('static-project-456')
    })

    it('should reject invalid characters in static projectId', () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'invalid project!',
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid projectId format')
      )
    })
  })

  describe('T026: Synchronous Function projectId', () => {
    it('should evaluate synchronous function projectId', () => {
      let domainBasedFn = () => 'domain-project-456'

      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: domainBasedFn,
      })

      expect(weaverse.configs.projectId).toBe('domain-project-456')
    })

    it('should fall back to environment when function returns empty string', () => {
      let emptyFn = () => ''

      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: emptyFn,
      })

      // Should fall back to WEAVERSE_PROJECT_ID from env
      expect(weaverse.configs.projectId).toBe('env-project-default')
    })

    it('should validate format of function-returned projectId', () => {
      let invalidFn = () => 'invalid project!'

      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: invalidFn,
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid projectId format')
      )
    })
  })

  describe('T027: Async Function Detection', () => {
    it('should throw error for async function passed directly', () => {
      let asyncFn = async () => 'async-project-789'

      expect(() => {
        new WeaverseClient({
          ...mockContext,
          components: mockComponents,
          themeSchema: mockThemeSchema,
          projectId: asyncFn,
        })
      }).toThrow('must be awaited')
    })

    it('should provide helpful error message for async functions', () => {
      let asyncFn = async () => 'async-project'

      try {
        new WeaverseClient({
          ...mockContext,
          components: mockComponents,
          themeSchema: mockThemeSchema,
          projectId: asyncFn,
        })
      } catch (err: any) {
        expect(err.message).toContain('await getProjectAsync()')
      }
    })
  })

  describe('T028: URL Query Param Override', () => {
    it('should override function result with URL query param', () => {
      let request = new Request(
        'https://test-store.myshopify.com?weaverseProjectId=override-project-999'
      )
      let mockCtx = createMockContext({ request })
      let functionFn = () => 'function-project-456'

      let weaverse = new WeaverseClient({
        ...mockCtx,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: functionFn,
      })

      expect(weaverse.configs.projectId).toBe('override-project-999')
    })

    it('should override static string with URL query param', () => {
      let request = new Request(
        'https://test-store.myshopify.com?weaverseProjectId=override-project-999'
      )
      let mockCtx = createMockContext({ request })

      let weaverse = new WeaverseClient({
        ...mockCtx,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'static-project-123',
      })

      expect(weaverse.configs.projectId).toBe('override-project-999')
    })
  })

  describe('T029: Priority Chain', () => {
    it('should follow priority: URL > Function > String > Env', () => {
      let request = new Request('https://test-store.myshopify.com')
      let mockCtx = createMockContext({ request })
      let functionFn = () => 'function-project'

      let weaverse = new WeaverseClient({
        ...mockCtx,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: functionFn,
      })

      expect(weaverse.configs.projectId).toBe('function-project')
    })
  })

  describe('T030: Error Handling', () => {
    it('should handle function throwing error gracefully', () => {
      let errorFn = () => {
        throw new Error('Test error')
      }

      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: errorFn,
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
      let calls = consoleErrorSpy.mock.calls
      let errorCall = calls.some((call: any[]) =>
        call.some((arg: any) =>
          String(arg).includes('Failed to evaluate projectId function')
        )
      )
      expect(errorCall).toBe(true)
    })

    it('should log stack trace for unexpected errors', () => {
      let errorFn = () => {
        throw new Error('Unexpected error')
      }

      new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: errorFn,
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
      let calls = consoleErrorSpy.mock.calls
      let stackTraceCall = calls.some((call: any[]) =>
        call.some((arg: any) => String(arg).includes('Stack trace'))
      )
      expect(stackTraceCall).toBe(true)
    })
  })

  describe('T031: Cache Isolation', () => {
    it('should include projectId in cache key', () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'project-abc',
      })

      expect(weaverse.configs.projectId).toBe('project-abc')
    })
  })

  describe('T032: Route-Level Override', () => {
    it('should validate route-level projectId is string', async () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'client-project',
      })

      let consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      let result = await weaverse.loadPage({ projectId: 123 as any })

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()
      let calls = consoleErrorSpy.mock.calls
      let errorCall = calls.some((call: any[]) =>
        call.some((arg: any) => String(arg).includes('must be a string'))
      )
      expect(errorCall).toBe(true)
      consoleErrorSpy.mockRestore()
    })

    it('should reject empty string for route-level projectId', async () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'client-project',
      })

      let consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      let result = await weaverse.loadPage({ projectId: '   ' })

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()
      let calls = consoleErrorSpy.mock.calls
      let errorCall = calls.some((call: any[]) =>
        call.some((arg: any) => String(arg).includes('cannot be empty'))
      )
      expect(errorCall).toBe(true)
      consoleErrorSpy.mockRestore()
    })

    it('should validate route-level projectId format', async () => {
      let weaverse = new WeaverseClient({
        ...mockContext,
        components: mockComponents,
        themeSchema: mockThemeSchema,
        projectId: 'client-project',
      })

      let consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      let result = await weaverse.loadPage({ projectId: 'invalid project!' })

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()
      let calls = consoleErrorSpy.mock.calls
      let errorCall = calls.some((call: any[]) =>
        call.some((arg: any) =>
          String(arg).includes('Invalid route-level projectId format')
        )
      )
      expect(errorCall).toBe(true)
      consoleErrorSpy.mockRestore()
    })
  })
})

function createMockContext(overrides: any = {}): any {
  let request =
    overrides.request || new Request('https://test-store.myshopify.com')

  return {
    customerAccount: null,
    env: {
      WEAVERSE_PROJECT_ID: 'env-project-default',
    },
    storefront: {
      i18n: { language: 'EN', country: 'US' },
      CacheCustom: (strategy: any) => strategy,
    },
    cache: {
      put: vi.fn(),
      match: vi.fn(),
    },
    waitUntil: vi.fn(),
    request,
    ...overrides,
  }
}
