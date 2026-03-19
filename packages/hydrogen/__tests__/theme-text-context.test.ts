import { describe, expect, it } from 'vitest'
import { getNestedKey, interpolate } from '../src/hooks/theme-text-context'

describe('getNestedKey', () => {
  const data = {
    cart: {
      title: 'Cart',
      empty: {
        message: "Looks like you haven't added anything yet!",
        startShopping: 'Start Shopping',
      },
    },
    badge: {
      sale: '-{{percentage}}% Off',
      new: 'New',
    },
    product: {
      addToCart: 'Add to cart',
    },
  }

  it('should resolve a top-level key', () => {
    const flat = { title: 'Hello' }
    expect(getNestedKey(flat, 'title')).toBe('Hello')
  })

  it('should resolve a single-level nested key', () => {
    expect(getNestedKey(data, 'badge.new')).toBe('New')
  })

  it('should resolve a deeply nested key', () => {
    expect(getNestedKey(data, 'cart.empty.message')).toBe(
      "Looks like you haven't added anything yet!"
    )
  })

  it('should return fallback for missing keys', () => {
    expect(getNestedKey(data, 'cart.missing', 'fallback')).toBe('fallback')
  })

  it('should return undefined for missing keys when no fallback', () => {
    expect(getNestedKey(data, 'cart.missing')).toBeUndefined()
  })

  it('should return fallback when traversing through a non-object', () => {
    expect(getNestedKey(data, 'badge.sale.deeper', 'fb')).toBe('fb')
  })

  it('should return fallback for empty object', () => {
    expect(getNestedKey({}, 'any.key', 'default')).toBe('default')
  })

  it('should return fallback when value is not a string (e.g. object node)', () => {
    // cart.empty is an object, not a string
    expect(getNestedKey(data, 'cart.empty', 'fb')).toBe('fb')
  })
})

describe('interpolate', () => {
  it('should replace a single variable', () => {
    expect(interpolate('Hello {{name}}!', { name: 'World' })).toBe(
      'Hello World!'
    )
  })

  it('should replace numeric variables', () => {
    expect(interpolate('-{{percentage}}% Off', { percentage: 15 })).toBe(
      '-15% Off'
    )
  })

  it('should replace multiple variables', () => {
    expect(
      interpolate('{{greeting}}, {{name}}!', {
        greeting: 'Hi',
        name: 'Alice',
      })
    ).toBe('Hi, Alice!')
  })

  it('should leave unmatched placeholders as-is', () => {
    expect(interpolate('Hello {{name}}!', {})).toBe('Hello {{name}}!')
  })

  it('should return template as-is when no variables provided', () => {
    expect(interpolate('Hello World!')).toBe('Hello World!')
    expect(interpolate('Hello {{name}}!', undefined)).toBe('Hello {{name}}!')
  })

  it('should handle empty string variables', () => {
    expect(interpolate('Cart ({{count}})', { count: '' })).toBe('Cart ()')
  })

  it('should handle zero as a variable', () => {
    expect(interpolate('Items: {{count}}', { count: 0 })).toBe('Items: 0')
  })
})

describe('t() function integration', () => {
  // Simulate the t() logic directly (same as in ThemeTextProvider)
  function createT(
    staticContent: Record<string, unknown>,
    merchantOverrides?: Record<string, unknown>,
    externalT?: (
      key: string,
      variables?: Record<string, string | number>
    ) => string
  ) {
    return (
      key: string,
      variables?: Record<string, string | number>
    ): string => {
      // Priority 1: external t
      if (externalT) {
        const external = externalT(key, variables)
        if (external && external !== key) {
          return external
        }
      }
      // Priority 2: merchant overrides
      const override = merchantOverrides
        ? getNestedKey(merchantOverrides, key)
        : undefined
      // Priority 3: static content
      const staticValue = getNestedKey(staticContent, key)
      // Priority 4: key itself
      const raw = override ?? staticValue ?? key
      return interpolate(raw, variables)
    }
  }

  const staticContent = {
    cart: {
      title: 'Cart',
      empty: {
        message:
          "Looks like you haven't added anything yet, let's get you started!",
      },
    },
    badge: {
      sale: '-{{percentage}}% Off',
    },
    product: {
      addToCart: 'Add to cart',
      pictureOf: 'Picture of {{name}}',
    },
  }

  it('should resolve from staticContent', () => {
    const t = createT(staticContent)
    expect(t('cart.title')).toBe('Cart')
    expect(t('product.addToCart')).toBe('Add to cart')
  })

  it('should prefer merchantOverrides over staticContent', () => {
    const overrides = {
      cart: {
        title: 'Giỏ hàng',
      },
    }
    const t = createT(staticContent, overrides)
    expect(t('cart.title')).toBe('Giỏ hàng')
    // Non-overridden key still falls back to staticContent
    expect(t('product.addToCart')).toBe('Add to cart')
  })

  it('should interpolate variables after resolving', () => {
    const t = createT(staticContent)
    expect(t('badge.sale', { percentage: 20 })).toBe('-20% Off')
    expect(t('product.pictureOf', { name: 'Red Sneakers' })).toBe(
      'Picture of Red Sneakers'
    )
  })

  it('should interpolate variables in merchant overrides', () => {
    const overrides = {
      badge: {
        sale: 'Giảm {{percentage}}%',
      },
    }
    const t = createT(staticContent, overrides)
    expect(t('badge.sale', { percentage: 30 })).toBe('Giảm 30%')
  })

  it('should return the key itself as fallback when not found', () => {
    const t = createT(staticContent)
    expect(t('unknown.key')).toBe('unknown.key')
  })

  it('should return key with interpolation even when not found', () => {
    const t = createT(staticContent)
    // Key not found, but has variables pattern in the key itself – treated as literal
    expect(t('missing.{{key}}')).toBe('missing.{{key}}')
  })

  it('should handle empty staticContent gracefully', () => {
    const t = createT({})
    expect(t('cart.title')).toBe('cart.title')
  })

  it('should handle undefined merchantOverrides gracefully', () => {
    const t = createT(staticContent, undefined)
    expect(t('cart.title')).toBe('Cart')
  })

  // --- External t tests ---

  it('should prefer external t over merchantOverrides and staticContent', () => {
    const externalT = (key: string) => (key === 'cart.title' ? 'Panier' : key)
    const overrides = { cart: { title: 'Giỏ hàng' } }
    const t = createT(staticContent, overrides, externalT)
    // External t wins even though merchantOverrides also has a value
    expect(t('cart.title')).toBe('Panier')
    // Keys not handled by external t still fall through normally
    expect(t('product.addToCart')).toBe('Add to cart')
  })

  it('should fall through when external t echoes the key', () => {
    // External t returns the key unchanged → internal chain takes over
    const externalT = (key: string) => key
    const t = createT(staticContent, undefined, externalT)
    expect(t('cart.title')).toBe('Cart')
    expect(t('badge.sale', { percentage: 10 })).toBe('-10% Off')
  })

  it('should forward variables to external t', () => {
    const externalT = (key: string, vars?: Record<string, string | number>) => {
      if (key === 'badge.sale' && vars?.percentage) {
        return `Sale ${vars.percentage}%`
      }
      return key
    }
    const t = createT(staticContent, undefined, externalT)
    expect(t('badge.sale', { percentage: 25 })).toBe('Sale 25%')
  })

  it('should fall through when external t returns empty string', () => {
    const externalT = () => ''
    const t = createT(staticContent, undefined, externalT)
    // Empty string is falsy → falls through to staticContent
    expect(t('cart.title')).toBe('Cart')
  })

  it('should work with undefined externalT (backwards compat)', () => {
    const t = createT(staticContent, undefined, undefined)
    expect(t('cart.title')).toBe('Cart')
  })
})
