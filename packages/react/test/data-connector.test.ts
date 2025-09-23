import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  replaceContentDataConnectors,
  replaceContentDataConnectorsDeep,
} from '../src/utils/data-connector'

describe('replaceContentDataConnectors', () => {
  const mockLoaderData = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      profile: {
        bio: 'Software Engineer',
      },
    },
    products: [
      { title: 'Product 1', price: 99.99 },
      { title: 'Product 2', price: 149.99 },
    ],
    company: {
      name: 'Acme Corp',
      employees: [
        { name: 'Alice', role: 'Manager' },
        { name: 'Bob', role: 'Developer' },
      ],
    },
    htmlContent: '<script>alert("xss")</script>',
    specialChars: 'Test & <markup> "quotes" \'apostrophe\'',
  }

  beforeEach(() => {
    // Clear any console warnings
    vi.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('should return original content when loaderData is null', () => {
      const content = 'Hello {{user.name}}'
      const result = replaceContentDataConnectors(content, null)
      expect(result).toBe(content)
    })

    it('should return original content when loaderData is undefined', () => {
      const content = 'Hello {{user.name}}'
      const result = replaceContentDataConnectors(content, undefined)
      expect(result).toBe(content)
    })

    it('should return original content when content is not a string', () => {
      const content = 123 as any
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe(content)
    })

    it('should replace simple property paths', () => {
      const content = 'Hello {{user.name}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Hello John Doe')
    })

    it('should replace multiple placeholders in one string', () => {
      const content = 'Hello {{user.name}}, your email is {{user.email}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Hello John Doe, your email is john@example.com')
    })

    it('should handle nested object properties', () => {
      const content = 'Bio: {{user.profile.bio}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Bio: Software Engineer')
    })
  })

  describe('Array indexing', () => {
    it('should handle array indexing with bracket notation', () => {
      const content = 'First product: {{products[0].title}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('First product: Product 1')
    })

    it('should handle array indexing with numbers', () => {
      const content = 'Price: ${{products[1].price}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Price: $149.99')
    })

    it('should handle nested arrays', () => {
      const content = 'Manager: {{company.employees[0].name}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Manager: Alice')
    })

    it('should return placeholder for out-of-bounds array access', () => {
      const content = 'Product: {{products[10].title}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Product: {{products[10].title}}')
    })
  })

  describe('Edge cases', () => {
    it('should handle whitespace in placeholders', () => {
      const content = 'Hello {{ user.name }}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Hello John Doe')
    })

    it('should return placeholder for non-existent paths', () => {
      const content = 'Hello {{user.nonexistent}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Hello {{user.nonexistent}}')
    })

    it('should handle empty placeholder', () => {
      const content = 'Hello {{}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Hello {{}}')
    })

    it('should handle malformed placeholders', () => {
      const content = 'Hello {{user.name'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe('Hello {{user.name')
    })

    it('should handle null values in data', () => {
      const dataWithNull = { ...mockLoaderData, nullValue: null }
      const content = 'Value: {{nullValue}}'
      const result = replaceContentDataConnectors(content, dataWithNull)
      expect(result).toBe('Value: {{nullValue}}')
    })

    it('should handle undefined values in data', () => {
      const dataWithUndefined = { ...mockLoaderData, undefinedValue: undefined }
      const content = 'Value: {{undefinedValue}}'
      const result = replaceContentDataConnectors(content, dataWithUndefined)
      expect(result).toBe('Value: {{undefinedValue}}')
    })
  })

  describe('Security (XSS Protection)', () => {
    it('should sanitize HTML content', () => {
      const content = 'Content: {{htmlContent}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe(
        'Content: &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      )
    })

    it('should sanitize special characters', () => {
      const content = 'Text: {{specialChars}}'
      const result = replaceContentDataConnectors(content, mockLoaderData)
      expect(result).toBe(
        'Text: Test &amp; &lt;markup&gt; &quot;quotes&quot; &#x27;apostrophe&#x27;'
      )
    })

    it('should handle ampersands correctly', () => {
      const dataWithAmpersand = { text: 'Tom & Jerry' }
      const content = 'Show: {{text}}'
      const result = replaceContentDataConnectors(content, dataWithAmpersand)
      expect(result).toBe('Show: Tom &amp; Jerry')
    })
  })

  describe('Performance and caching', () => {
    it('should cache results for identical inputs', () => {
      const content = 'Hello {{user.name}}'

      // First call
      const result1 = replaceContentDataConnectors(content, mockLoaderData)

      // Second call with same inputs should use cache
      const result2 = replaceContentDataConnectors(content, mockLoaderData)

      expect(result1).toBe(result2)
      expect(result1).toBe('Hello John Doe')
    })

    it('should handle large data objects without performance issues', () => {
      const largeData = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: `Description for item ${i}`,
        })),
      }

      const content =
        'First item: {{items[0].name}}, Last item: {{items[999].name}}'
      const result = replaceContentDataConnectors(content, largeData)
      expect(result).toBe('First item: Item 0, Last item: Item 999')
    })
  })

  describe('Circular reference protection', () => {
    it('should handle circular references gracefully', () => {
      const circularData: any = {
        user: {
          name: 'John',
        },
      }
      circularData.user.self = circularData.user // Create circular reference

      // Mock console.warn to check if warning is logged
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const content = 'Name: {{user.name}}'
      const result = replaceContentDataConnectors(content, circularData)

      // Should still work for non-circular paths
      expect(result).toBe('Name: John')

      consoleSpy.mockRestore()
    })

    it('should detect deep circular references', () => {
      const deepCircularData: any = {
        level1: {
          level2: {
            name: 'Deep Value',
          },
        },
      }
      deepCircularData.level1.level2.circular = deepCircularData.level1

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const content = 'Value: {{level1.level2.name}}'
      const result = replaceContentDataConnectors(content, deepCircularData)

      expect(result).toBe('Value: Deep Value')

      consoleSpy.mockRestore()
    })
  })

  describe('Error handling', () => {
    it('should handle errors gracefully and return original content', () => {
      // Create problematic data that might cause errors
      const problematicData = {
        get errorProperty() {
          throw new Error('Property access error')
        },
      }

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const content = 'Value: {{errorProperty}}'
      const result = replaceContentDataConnectors(content, problematicData)

      // Should return original placeholder when error occurs
      expect(result).toBe('Value: {{errorProperty}}')

      consoleSpy.mockRestore()
    })

    it('should log errors with context information', () => {
      // Create data that causes error during property access, not cache key generation
      const problematicData = {
        errorProperty: {
          get nested() {
            throw new Error('Property access error')
          },
        },
      }

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const content = 'Value: {{errorProperty.nested}}'
      replaceContentDataConnectors(content, problematicData)

      // The error should be caught and logged by the path-specific error handler
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error resolving data connector path'),
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Type coercion', () => {
    it('should convert numbers to strings', () => {
      const dataWithNumbers = { count: 42, price: 99.99 }
      const content = 'Count: {{count}}, Price: {{price}}'
      const result = replaceContentDataConnectors(content, dataWithNumbers)
      expect(result).toBe('Count: 42, Price: 99.99')
    })

    it('should convert booleans to strings', () => {
      const dataWithBooleans = { isActive: true, isVisible: false }
      const content = 'Active: {{isActive}}, Visible: {{isVisible}}'
      const result = replaceContentDataConnectors(content, dataWithBooleans)
      expect(result).toBe('Active: true, Visible: false')
    })

    it('should handle complex objects by converting to string', () => {
      const dataWithObject = {
        obj: { name: 'test' },
        arr: [1, 2, 3],
      }
      const content = 'Object: {{obj}}, Array: {{arr}}'
      const result = replaceContentDataConnectors(content, dataWithObject)
      expect(result).toContain('Object: [object Object]')
      expect(result).toContain('Array: 1,2,3')
    })
  })

  describe('Flat Route-Keyed Data Context (Option 1)', () => {
    // Flat route-keyed structure: {root: {...}, "routes/xxx": {...}}
    const mockFlatDataContext = {
      root: {
        layout: {
          shop: { name: 'My Store' },
          headerMenu: { items: [{ title: 'Home' }, { title: 'Products' }] },
        },
        seo: { title: 'Home Page' },
        consent: { country: 'US' },
      },
      'routes/product': {
        product: { title: 'Amazing Product', price: 99 },
        variants: [
          { id: 1, title: 'Red' },
          { id: 2, title: 'Blue' },
        ],
      },
      'routes/collection': {
        collection: { name: 'Electronics', handle: 'electronics' },
        products: [{ title: 'Product 1' }, { title: 'Product 2' }],
      },
    }

    it('should resolve route-specific paths with explicit route keys', () => {
      const content = 'Welcome to {{root.layout.shop.name}}!'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('Welcome to My Store!')
    })

    it('should resolve array elements from route-specific data', () => {
      const content = 'Menu: {{root.layout.headerMenu.items[0].title}}'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('Menu: Home')
    })

    test('should resolve nested paths from specific routes', () => {
      const content = 'Product: {{routes/product.product.title}}'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('Product: Amazing Product')
    })

    test('should resolve multiple properties from different routes', () => {
      const content =
        '{{routes/product.product.title}} - ${{routes/product.product.price}}'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('Amazing Product - $99')
    })

    test('should handle missing data gracefully', () => {
      const content = '{{missing.data}} {{routes/product.product.title}}'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('{{missing.data}} Amazing Product')
    })

    test('should handle missing data gracefully', () => {
      const partialContext = {
        root: { user: { name: 'Test User' } },
      }

      const content = '{{missing.data}} {{user.name}}'
      const result = replaceContentDataConnectors(content, partialContext)
      expect(result).toBe('{{missing.data}} Test User')
    })

    test('should work with complex nested paths across different routes', () => {
      const content =
        '{{root.seo.title}} - {{routes/product.product.title}} in {{routes/collection.collection.name}}'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('Home Page - Amazing Product in Electronics')
    })

    test('should maintain backward compatibility with legacy non-route-keyed data', () => {
      const legacyData = {
        user: { name: 'John' },
        product: { title: 'Legacy Product' },
      }
      const content = 'Hello {{user.name}}, check out {{product.title}}'
      const result = replaceContentDataConnectors(content, legacyData)
      expect(result).toBe('Hello John, check out Legacy Product')
    })

    test('should handle route keys with special characters', () => {
      const content = 'Collection: {{routes/collection.collection.handle}}'
      const result = replaceContentDataConnectors(content, mockFlatDataContext)
      expect(result).toBe('Collection: electronics')
    })
  })

  describe('Deep Object Replacement (replaceContentDataConnectorsDeep)', () => {
    const mockDeepData = {
      root: {
        layout: {
          shop: { name: 'Deep Store' },
          user: { name: 'Alice' },
        },
      },
      'routes/product': {
        product: { title: 'Deep Product', price: 199.99 },
      },
    }

    it('should handle string values (same as basic function)', () => {
      const content = 'Hello {{root.layout.user.name}}'
      const result = replaceContentDataConnectorsDeep(content, mockDeepData)
      expect(result).toBe('Hello Alice')
    })

    it('should recursively replace strings in objects', () => {
      const contentObj = {
        title: 'Welcome to {{root.layout.shop.name}}',
        greeting: 'Hello {{root.layout.user.name}}',
        price: 'Product costs ${{routes/product.product.price}}',
        metadata: {
          description: 'Shop: {{root.layout.shop.name}}',
          nested: {
            info: 'User: {{root.layout.user.name}}',
          },
        },
      }

      const result = replaceContentDataConnectorsDeep(contentObj, mockDeepData)

      expect(result).toEqual({
        title: 'Welcome to Deep Store',
        greeting: 'Hello Alice',
        price: 'Product costs $199.99',
        metadata: {
          description: 'Shop: Deep Store',
          nested: {
            info: 'User: Alice',
          },
        },
      })
    })

    it('should recursively replace strings in arrays', () => {
      const contentArray = [
        'Welcome to {{root.layout.shop.name}}',
        'Hello {{root.layout.user.name}}',
        {
          title: 'Product: {{routes/product.product.title}}',
          price: '${{routes/product.product.price}}',
        },
        [
          'Nested: {{root.layout.user.name}}',
          'Array: {{root.layout.shop.name}}',
        ],
      ]

      const result = replaceContentDataConnectorsDeep(
        contentArray,
        mockDeepData
      )

      expect(result).toEqual([
        'Welcome to Deep Store',
        'Hello Alice',
        {
          title: 'Product: Deep Product',
          price: '$199.99',
        },
        ['Nested: Alice', 'Array: Deep Store'],
      ])
    })

    it('should handle mixed object and array structures', () => {
      const complexContent = {
        header: {
          title: 'Welcome to {{root.layout.shop.name}}',
          navigation: [
            { label: 'Home', url: '/home?user={{root.layout.user.name}}' },
            { label: 'Products', url: '/products' },
          ],
        },
        products: [
          {
            name: '{{routes/product.product.title}}',
            price: '${{routes/product.product.price}}',
            description: 'Available at {{root.layout.shop.name}}',
          },
        ],
        footer: {
          copyright:
            '© {{root.layout.shop.name}} - Contact: {{root.layout.user.name}}',
        },
      }

      const result = replaceContentDataConnectorsDeep(
        complexContent,
        mockDeepData
      )

      expect(result).toEqual({
        header: {
          title: 'Welcome to Deep Store',
          navigation: [
            { label: 'Home', url: '/home?user=Alice' },
            { label: 'Products', url: '/products' },
          ],
        },
        products: [
          {
            name: 'Deep Product',
            price: '$199.99',
            description: 'Available at Deep Store',
          },
        ],
        footer: {
          copyright: '© Deep Store - Contact: Alice',
        },
      })
    })

    it('should preserve non-string primitive values', () => {
      const content = {
        title: 'Welcome to {{root.layout.shop.name}}',
        count: 42,
        isActive: true,
        amount: null,
        undefined,
        price: 99.99,
      }

      const result = replaceContentDataConnectorsDeep(content, mockDeepData)

      expect(result).toEqual({
        title: 'Welcome to Deep Store',
        count: 42,
        isActive: true,
        amount: null,
        undefined,
        price: 99.99,
      })
    })

    it('should handle empty objects and arrays', () => {
      const content = {
        empty: {},
        emptyArray: [],
        title: 'Shop: {{root.layout.shop.name}}',
      }

      const result = replaceContentDataConnectorsDeep(content, mockDeepData)

      expect(result).toEqual({
        empty: {},
        emptyArray: [],
        title: 'Shop: Deep Store',
      })
    })

    it('should return original data when dataContext is null/undefined', () => {
      const content = {
        title: 'Welcome to {{root.layout.shop.name}}',
        nested: {
          info: 'User: {{root.layout.user.name}}',
        },
      }

      const resultNull = replaceContentDataConnectorsDeep(content, null)
      const resultUndefined = replaceContentDataConnectorsDeep(
        content,
        undefined
      )

      expect(resultNull).toEqual(content)
      expect(resultUndefined).toEqual(content)
    })

    it('should handle circular references gracefully', () => {
      const circularContent: any = {
        title: 'Welcome to {{root.layout.shop.name}}',
        nested: {
          info: 'User: {{root.layout.user.name}}',
        },
      }
      circularContent.nested.circular = circularContent

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = replaceContentDataConnectorsDeep(
        circularContent,
        mockDeepData
      )

      // Should still process non-circular parts
      expect(result.title).toBe('Welcome to Deep Store')
      expect(result.nested.info).toBe('User: Alice')

      consoleSpy.mockRestore()
    })

    it('should handle errors gracefully and return original data', () => {
      const problematicContent = {
        get errorProperty() {
          throw new Error('Property access error')
        },
        title: 'Welcome to {{root.layout.shop.name}}',
      }

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = replaceContentDataConnectorsDeep(
        problematicContent,
        mockDeepData
      )

      // Should return original object when error occurs
      expect(result).toBe(problematicContent)

      consoleSpy.mockRestore()
    })
  })
})
