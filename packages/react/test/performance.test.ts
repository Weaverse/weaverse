import { describe, expect, it } from 'vitest'
import { replaceContentDataConnectorsDeep } from '../src/utils/data-connector'

describe('Data Connector Performance Optimizations', () => {
  const mockDataContext = {
    root: {
      shop: { name: 'Test Shop' },
      user: { name: 'John Doe' },
    },
    product: {
      title: 'Amazing Product',
      price: 99.99,
    },
  }

  describe('Early exit optimization for replaceContentDataConnectorsDeep', () => {
    it('should return original data immediately when no placeholders exist', () => {
      const dataWithoutPlaceholders = {
        title: 'Plain Title',
        description: 'Plain description',
        nested: {
          items: ['item1', 'item2', 'item3'],
          metadata: {
            count: 42,
            enabled: true,
          },
        },
      }

      const result = replaceContentDataConnectorsDeep(
        dataWithoutPlaceholders,
        mockDataContext
      )

      // Should return exact same reference (no processing)
      expect(result).toBe(dataWithoutPlaceholders)
    })

    it('should process data when placeholders exist', () => {
      const dataWithPlaceholders = {
        title: 'Welcome to {{root.shop.name}}',
        description: 'Plain description',
        nested: {
          items: ['item1', 'item2'],
        },
      }

      const result = replaceContentDataConnectorsDeep(
        dataWithPlaceholders,
        mockDataContext
      )

      // Should create new object and process placeholders
      expect(result).not.toBe(dataWithPlaceholders)
      expect(result.title).toBe('Welcome to Test Shop')
      expect(result.description).toBe('Plain description')
    })

    it('should handle empty objects quickly', () => {
      const emptyData = {}
      const result = replaceContentDataConnectorsDeep(
        emptyData,
        mockDataContext
      )

      // Should return same reference
      expect(result).toBe(emptyData)
    })

    it('should handle arrays without placeholders quickly', () => {
      const arrayData = [1, 2, 3, 'plain', 'strings', { key: 'value' }]
      const result = replaceContentDataConnectorsDeep(
        arrayData,
        mockDataContext
      )

      // Should return same reference
      expect(result).toBe(arrayData)
    })

    it('should process deeply nested data only when placeholders exist', () => {
      const deepData = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  title: 'No placeholders here',
                  items: [1, 2, 3, 4, 5],
                },
              },
            },
          },
        },
      }

      const result = replaceContentDataConnectorsDeep(deepData, mockDataContext)

      // Should return same reference (early exit)
      expect(result).toBe(deepData)
    })

    it('should detect placeholders in deeply nested structures', () => {
      const deepDataWithPlaceholder = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  title: 'Shop: {{root.shop.name}}',
                  items: [1, 2, 3],
                },
              },
            },
          },
        },
      }

      const result = replaceContentDataConnectorsDeep(
        deepDataWithPlaceholder,
        mockDataContext
      )

      // Should create new object and process
      expect(result).not.toBe(deepDataWithPlaceholder)
      expect(result.level1.level2.level3.level4.level5.title).toBe(
        'Shop: Test Shop'
      )
    })

    it('should handle arrays with placeholders in nested objects', () => {
      const arrayWithNestedPlaceholders = [
        { title: 'Plain' },
        { title: 'Has {{product.title}}' },
        { title: 'Another plain' },
      ]

      const result = replaceContentDataConnectorsDeep(
        arrayWithNestedPlaceholders,
        mockDataContext
      )

      // Should create new array and process
      expect(result).not.toBe(arrayWithNestedPlaceholders)
      expect(result[0].title).toBe('Plain')
      expect(result[1].title).toBe('Has Amazing Product')
      expect(result[2].title).toBe('Another plain')
    })
  })

  describe('hasPlaceholders detection', () => {
    it('should detect placeholders in string', () => {
      const data = 'Hello {{root.shop.name}}'
      const result = replaceContentDataConnectorsDeep(data, mockDataContext)
      expect(result).toBe('Hello Test Shop')
    })

    it('should skip processing string without placeholders', () => {
      const data = 'Hello world'
      const result = replaceContentDataConnectorsDeep(data, mockDataContext)
      expect(result).toBe('Hello world')
    })

    it('should detect placeholders in object values', () => {
      const data = {
        plain: 'no placeholder',
        withPlaceholder: '{{product.title}}',
      }
      const result = replaceContentDataConnectorsDeep(data, mockDataContext)
      expect(result.withPlaceholder).toBe('Amazing Product')
    })

    it('should detect placeholders in array items', () => {
      const data = ['plain', '{{product.title}}', 'another plain']
      const result = replaceContentDataConnectorsDeep(data, mockDataContext)
      expect(result[1]).toBe('Amazing Product')
    })

    it('should handle circular references in hasPlaceholders check', () => {
      const circularData: any = {
        title: 'No placeholder',
        nested: {},
      }
      circularData.nested.parent = circularData

      const result = replaceContentDataConnectorsDeep(
        circularData,
        mockDataContext
      )

      // Should return same reference (no placeholders detected)
      expect(result).toBe(circularData)
    })
  })

  describe('Cache key generation performance', () => {
    it('should use stable hashing for same dataContext reference', () => {
      const content = {
        title: 'Hello {{root.shop.name}}',
        items: ['{{product.title}}'],
      }

      // Multiple calls with same dataContext should use cached results
      const result1 = replaceContentDataConnectorsDeep(content, mockDataContext)
      const result2 = replaceContentDataConnectorsDeep(content, mockDataContext)

      // Both should process correctly
      expect(result1.title).toBe('Hello Test Shop')
      expect(result2.title).toBe('Hello Test Shop')
    })

    it('should handle different dataContext objects correctly', () => {
      const content = { title: 'Hello {{root.shop.name}}' }

      const dataContext1 = {
        root: { shop: { name: 'Shop 1' } },
      }

      const dataContext2 = {
        root: { shop: { name: 'Shop 2' } },
      }

      const result1 = replaceContentDataConnectorsDeep(content, dataContext1)
      const result2 = replaceContentDataConnectorsDeep(content, dataContext2)

      // Should produce different results
      expect(result1.title).toBe('Hello Shop 1')
      expect(result2.title).toBe('Hello Shop 2')
    })
  })

  describe('Performance regression prevention', () => {
    it('should process 50 components without placeholders in under 10ms', () => {
      const componentData = Array.from({ length: 50 }, (_, i) => ({
        id: `component-${i}`,
        title: `Component ${i}`,
        description: 'Plain description',
        items: [1, 2, 3, 4, 5],
        nested: {
          metadata: {
            count: i,
            enabled: true,
          },
        },
      }))

      const start = performance.now()

      for (const data of componentData) {
        replaceContentDataConnectorsDeep(data, mockDataContext)
      }

      const elapsed = performance.now() - start

      // Should be nearly instant (< 10ms for 50 components without placeholders)
      // This is the critical path that was causing 10s delays on Cloudflare Workers
      expect(elapsed).toBeLessThan(10)
    })

    it('should process 50 components with placeholders efficiently', () => {
      const componentData = Array.from({ length: 50 }, (_, i) => ({
        id: `component-${i}`,
        title: `Component {{product.title}} ${i}`,
        description: 'Available at {{root.shop.name}}',
        items: [1, 2, 3],
      }))

      const start = performance.now()

      for (const data of componentData) {
        replaceContentDataConnectorsDeep(data, mockDataContext)
      }

      const elapsed = performance.now() - start

      // Should complete in reasonable time (< 50ms for 50 components with placeholders)
      expect(elapsed).toBeLessThan(50)
    })

    it('should handle mixed scenario efficiently (90% without, 10% with placeholders)', () => {
      // Simulate realistic usage: most components don't use data connectors
      const componentData = Array.from({ length: 50 }, (_, i) => {
        if (i % 10 === 0) {
          // 10% with placeholders
          return {
            id: `component-${i}`,
            title: `Component {{product.title}} ${i}`,
            description: 'Available at {{root.shop.name}}',
          }
        }
        // 90% without placeholders
        return {
          id: `component-${i}`,
          title: `Component ${i}`,
          description: 'Plain description',
          items: [1, 2, 3],
        }
      })

      const start = performance.now()

      for (const data of componentData) {
        replaceContentDataConnectorsDeep(data, mockDataContext)
      }

      const elapsed = performance.now() - start

      // Should be very fast since most components skip processing
      expect(elapsed).toBeLessThan(15)
    })
  })
})
