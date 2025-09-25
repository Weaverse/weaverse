import { describe, expect, it } from 'vitest'
import {
  replaceContentDataConnectors,
  replaceContentDataConnectorsDeep,
} from '../src/utils/data-connector'

describe('Complex Route Patterns Support', () => {
  const mockComplexDataContext = {
    // Simple routes (existing functionality)
    root: {
      shop: { name: 'Test Shop', domain: 'test.myshopify.com' },
      user: { name: 'John Doe', email: 'john@test.com' },
    },
    'routes/product': {
      product: {
        title: 'Amazing Product',
        price: 99.99,
        images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }],
      },
    },

    // Complex nested routes with special characters
    'routes/($locale)._index': {
      weaverseData: {
        page: {
          name: 'Homepage',
          title: 'Welcome to Our Store',
          meta: { description: 'The best products online' },
        },
      },
      localeData: {
        currency: 'USD',
        language: 'en',
      },
    },

    'routes/($locale).blogs.$blogHandle': {
      blog: {
        title: 'Our Blog',
        description: 'Latest news and updates',
        posts: [
          { title: 'First Post', slug: 'first-post' },
          { title: 'Second Post', slug: 'second-post' },
        ],
      },
      seo: {
        title: 'Blog SEO Title',
        description: 'Blog meta description',
      },
    },

    'routes/($locale).blogs.$blogHandle.$articleHandle': {
      article: {
        title: 'How to Use Our Products',
        content: '<p>This is a detailed guide...</p>',
        author: { name: 'Jane Smith', bio: 'Product Expert' },
        publishedAt: '2024-01-15',
        tags: ['tutorial', 'products', 'guide'],
      },
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blogs/news' },
        {
          label: 'How to Use Our Products',
          url: '/blogs/news/how-to-use-products',
        },
      ],
    },

    // Even more complex nested route
    'routes/($locale).collections.$collectionHandle.products.$productHandle': {
      product: {
        title: 'Featured Product in Collection',
        price: 149.99,
        collection: { name: 'Featured Items', handle: 'featured' },
      },
      relatedProducts: [
        { title: 'Related Product 1', price: 89.99 },
        { title: 'Related Product 2', price: 119.99 },
      ],
    },
  }

  describe('Simple route resolution (backward compatibility)', () => {
    it('should resolve simple root properties', () => {
      const result = replaceContentDataConnectors(
        'Welcome to {{root.shop.name}}',
        mockComplexDataContext
      )
      expect(result).toBe('Welcome to Test Shop')
    })

    it('should resolve simple route properties', () => {
      const result = replaceContentDataConnectors(
        'Product: {{routes/product.product.title}}',
        mockComplexDataContext
      )
      expect(result).toBe('Product: Amazing Product')
    })
  })

  describe('Specific problematic route pattern', () => {
    it('should handle the original problematic pattern: routes/($locale)._index.weaverseData.page.name', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale)._index.weaverseData.page.name}}',
        mockComplexDataContext
      )
      expect(result).toBe('Homepage')
    })

    it('should handle deeply nested route from file pattern: app/routes/($locale).blogs.$blogHandle.$articleHandle.tsx', () => {
      const result = replaceContentDataConnectors(
        'Article: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}} by {{routes/($locale).blogs.$blogHandle.$articleHandle.article.author.name}}',
        mockComplexDataContext
      )
      expect(result).toBe('Article: How to Use Our Products by Jane Smith')
    })
  })

  describe('Complex route resolution with special characters', () => {
    it('should resolve locale index route', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale)._index.weaverseData.page.name}}',
        mockComplexDataContext
      )
      expect(result).toBe('Homepage')
    })

    it('should resolve nested properties in locale index route', () => {
      const result = replaceContentDataConnectors(
        'Page: {{routes/($locale)._index.weaverseData.page.title}} - {{routes/($locale)._index.localeData.currency}}',
        mockComplexDataContext
      )
      expect(result).toBe('Page: Welcome to Our Store - USD')
    })

    it('should resolve blog handle route', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale).blogs.$blogHandle.blog.title}}',
        mockComplexDataContext
      )
      expect(result).toBe('Our Blog')
    })

    it('should resolve deeply nested blog article route', () => {
      const result = replaceContentDataConnectors(
        'Article: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}} by {{routes/($locale).blogs.$blogHandle.$articleHandle.article.author.name}}',
        mockComplexDataContext
      )
      expect(result).toBe('Article: How to Use Our Products by Jane Smith')
    })

    it('should resolve ultra-complex collection product route', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale).collections.$collectionHandle.products.$productHandle.product.title}} - ${{routes/($locale).collections.$collectionHandle.products.$productHandle.product.price}}',
        mockComplexDataContext
      )
      expect(result).toBe('Featured Product in Collection - $149.99')
    })

    it('should handle array access in complex routes', () => {
      const result = replaceContentDataConnectors(
        'First tag: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.tags[0]}}',
        mockComplexDataContext
      )
      expect(result).toBe('First tag: tutorial')
    })
  })

  describe('Route specificity and precedence', () => {
    it('should choose the most specific route when multiple routes could match', () => {
      // If we had both "routes/($locale)" and "routes/($locale)._index",
      // it should choose the longer, more specific one
      const testContext = {
        'routes/($locale)': {
          general: { title: 'General Locale Data' },
        },
        'routes/($locale)._index': {
          specific: { title: 'Specific Index Data' },
        },
      }

      const result = replaceContentDataConnectors(
        '{{routes/($locale)._index.specific.title}}',
        testContext
      )
      expect(result).toBe('Specific Index Data')
    })

    it('should handle exact route key matches', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale)._index}}',
        mockComplexDataContext
      )
      // Should return the stringified object (since replaceContentDataConnectors returns strings)
      expect(result).toBe('[object Object]')
    })
  })

  describe('Deep replacement with complex routes', () => {
    it('should recursively replace complex route patterns in objects', () => {
      const data = {
        pageTitle: '{{routes/($locale)._index.weaverseData.page.title}}',
        articleInfo: {
          title:
            '{{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}}',
          author:
            '{{routes/($locale).blogs.$blogHandle.$articleHandle.article.author.name}}',
          metadata: [
            'Published: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.publishedAt}}',
            'Tags: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.tags[0]}}',
          ],
        },
        fallbackData: '{{root.shop.name}}',
      }

      const result = replaceContentDataConnectorsDeep(
        data,
        mockComplexDataContext
      )

      expect(result).toEqual({
        pageTitle: 'Welcome to Our Store',
        articleInfo: {
          title: 'How to Use Our Products',
          author: 'Jane Smith',
          metadata: ['Published: 2024-01-15', 'Tags: tutorial'],
        },
        fallbackData: 'Test Shop',
      })
    })

    it('should handle arrays with complex route patterns', () => {
      const data = [
        'Homepage: {{routes/($locale)._index.weaverseData.page.name}}',
        'Blog: {{routes/($locale).blogs.$blogHandle.blog.title}}',
        'Article: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}}',
      ]

      const result = replaceContentDataConnectorsDeep(
        data,
        mockComplexDataContext
      )

      expect(result).toEqual([
        'Homepage: Homepage',
        'Blog: Our Blog',
        'Article: How to Use Our Products',
      ])
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle non-existent complex routes gracefully', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale).nonexistent.data}}',
        mockComplexDataContext
      )
      // Should return the original placeholder when not found
      expect(result).toBe('{{routes/($locale).nonexistent.data}}')
    })

    it('should handle malformed route patterns', () => {
      const result = replaceContentDataConnectors(
        '{{routes/($locale).blogs.$blogHandle.nonexistent.deeply.nested.property}}',
        mockComplexDataContext
      )
      expect(result).toBe(
        '{{routes/($locale).blogs.$blogHandle.nonexistent.deeply.nested.property}}'
      )
    })

    it('should handle empty route data', () => {
      const testContext = {
        'routes/($locale)._index': null,
      }

      const result = replaceContentDataConnectors(
        '{{routes/($locale)._index.data}}',
        testContext
      )
      expect(result).toBe('{{routes/($locale)._index.data}}')
    })
  })

  describe('Performance considerations', () => {
    it('should handle many complex route patterns efficiently', () => {
      const manyTemplates = Array.from(
        { length: 100 },
        (_, i) =>
          `Template ${i}: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}}`
      )

      const startTime = performance.now()
      const results = manyTemplates.map((template) =>
        replaceContentDataConnectors(template, mockComplexDataContext)
      )
      const endTime = performance.now()

      // Should process all templates reasonably quickly (under 100ms)
      expect(endTime - startTime).toBeLessThan(100)
      expect(
        results.every((result) => result.includes('How to Use Our Products'))
      ).toBe(true)
    })
  })

  describe('Mixed patterns in single template', () => {
    it('should handle multiple different route patterns in one string', () => {
      const template = `
        Welcome to {{root.shop.name}}!
        Current page: {{routes/($locale)._index.weaverseData.page.name}}
        Featured article: {{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}}
         Product: {{routes/product.product.title}} (${'{{routes/product.product.price}}'})
        Collection item: {{routes/($locale).collections.$collectionHandle.products.$productHandle.product.title}}
      `.trim()

      const result = replaceContentDataConnectors(
        template,
        mockComplexDataContext
      )

      expect(result).toBe(
        `
        Welcome to Test Shop!
        Current page: Homepage
        Featured article: How to Use Our Products
         Product: Amazing Product (${99.99})
        Collection item: Featured Product in Collection
      `.trim()
      )
    })
  })
})
