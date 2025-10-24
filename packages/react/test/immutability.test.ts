import { describe, expect, it } from 'vitest'
import {
  replaceContentDataConnectors,
  replaceContentDataConnectorsDeep,
} from '../src/utils/data-connector'

describe('Data Connector Immutability Tests', () => {
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

  describe('replaceContentDataConnectors immutability', () => {
    it('should not mutate the original data context', () => {
      const originalContext = { ...mockDataContext }
      const content = 'Welcome to {{root.shop.name}}'

      replaceContentDataConnectors(content, mockDataContext)

      expect(mockDataContext).toEqual(originalContext)
    })

    it('should return processed content without affecting input', () => {
      const originalContent = 'Welcome to {{root.shop.name}}'
      const result = replaceContentDataConnectors(
        originalContent,
        mockDataContext
      )

      expect(result).toBe('Welcome to Test Shop')
      expect(originalContent).toBe('Welcome to {{root.shop.name}}')
    })
  })

  describe('replaceContentDataConnectorsDeep immutability', () => {
    it('should not mutate original primitive values', () => {
      const originalString = 'Hello {{root.user.name}}'
      const result = replaceContentDataConnectorsDeep(
        originalString,
        mockDataContext
      )

      expect(result).toBe('Hello John Doe')
      expect(originalString).toBe('Hello {{root.user.name}}')
    })

    it('should not mutate original object', () => {
      const originalData = {
        title: 'Product: {{product.title}}',
        price: '{{product.price}}',
        nested: {
          description: 'Available at {{root.shop.name}}',
        },
      }
      const originalDataCopy = JSON.parse(JSON.stringify(originalData))

      const result = replaceContentDataConnectorsDeep(
        originalData,
        mockDataContext
      )

      // Original should remain unchanged
      expect(originalData).toEqual(originalDataCopy)

      // Result should have replacements
      expect(result).toEqual({
        title: 'Product: Amazing Product',
        price: '99.99',
        nested: {
          description: 'Available at Test Shop',
        },
      })
    })

    it('should not mutate original array', () => {
      const originalArray = [
        'Welcome to {{root.shop.name}}',
        { title: '{{product.title}}' },
        ['Item: {{product.title}}', 'Price: {{product.price}}'],
      ]
      const originalArrayCopy = JSON.parse(JSON.stringify(originalArray))

      const result = replaceContentDataConnectorsDeep(
        originalArray,
        mockDataContext
      )

      // Original should remain unchanged
      expect(originalArray).toEqual(originalArrayCopy)

      // Result should have replacements
      expect(result).toEqual([
        'Welcome to Test Shop',
        { title: 'Amazing Product' },
        ['Item: Amazing Product', 'Price: 99.99'],
      ])
    })

    it('should handle deeply nested structures without mutation', () => {
      const originalData = {
        page: {
          sections: [
            {
              items: [
                {
                  content: {
                    title: 'Shop: {{root.shop.name}}',
                    product: {
                      name: '{{product.title}}',
                      info: 'Price: {{product.price}}',
                    },
                  },
                },
              ],
            },
          ],
        },
        metadata: {
          shopName: '{{root.shop.name}}',
        },
      }
      const originalDataCopy = JSON.parse(JSON.stringify(originalData))

      const result = replaceContentDataConnectorsDeep(
        originalData,
        mockDataContext
      )

      // Original should remain unchanged
      expect(originalData).toEqual(originalDataCopy)

      // Result should have all replacements
      expect(result.page.sections[0].items[0].content.title).toBe(
        'Shop: Test Shop'
      )
      expect(result.page.sections[0].items[0].content.product.name).toBe(
        'Amazing Product'
      )
      expect(result.page.sections[0].items[0].content.product.info).toBe(
        'Price: 99.99'
      )
      expect(result.metadata.shopName).toBe('Test Shop')
    })

    it('should handle circular references without infinite loops', () => {
      const circularData: any = {
        name: '{{root.shop.name}}',
        nested: {},
      }
      circularData.nested.parent = circularData

      const result = replaceContentDataConnectorsDeep(
        circularData,
        mockDataContext
      )

      // Should not throw and should process what it can
      expect(result.name).toBe('Test Shop')
      expect(typeof result.nested).toBe('object')
    })

    it('should preserve object references in result but not mutate originals', () => {
      const originalData = {
        items: [{ title: '{{product.title}}' }, { title: '{{product.title}}' }],
      }

      const result = replaceContentDataConnectorsDeep(
        originalData,
        mockDataContext
      )

      // Original items should still have template strings
      expect(originalData.items[0].title).toBe('{{product.title}}')
      expect(originalData.items[1].title).toBe('{{product.title}}')

      // Result items should have replacements
      expect(result.items[0].title).toBe('Amazing Product')
      expect(result.items[1].title).toBe('Amazing Product')

      // Result should be different objects
      expect(result).not.toBe(originalData)
      expect(result.items).not.toBe(originalData.items)
      expect(result.items[0]).not.toBe(originalData.items[0])
    })

    it('should handle Date objects correctly', () => {
      const testDate = new Date('2023-01-01')
      const originalData = {
        createdAt: testDate,
        title: 'Created on {{root.shop.name}}',
      }

      const result = replaceContentDataConnectorsDeep(
        originalData,
        mockDataContext
      )

      // When placeholders exist, object should be cloned
      // Date should be cloned to maintain immutability
      expect(result).not.toBe(originalData)
      expect(result.createdAt).toEqual(testDate)
      expect(result.createdAt).not.toBe(testDate)
      expect(result.title).toBe('Created on Test Shop')
    })
  })

  describe('Memory and performance considerations', () => {
    it('should handle large datasets without memory leaks', () => {
      const largeData = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          title: `Item ${i}: {{product.title}}`,
          description: 'Available at {{root.shop.name}}',
        })),
      }

      const result = replaceContentDataConnectorsDeep(
        largeData,
        mockDataContext
      )

      // All items should be processed
      expect(result.items).toHaveLength(1000)
      expect(result.items[0].title).toBe('Item 0: Amazing Product')
      expect(result.items[999].description).toBe('Available at Test Shop')

      // Original should be unchanged
      expect(largeData.items[0].title).toBe('Item 0: {{product.title}}')
    })
  })
})
