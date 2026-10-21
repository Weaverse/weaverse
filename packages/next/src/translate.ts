/**
 * Pure translation helpers, free of React so server code can call them.
 *
 * `translation-context.tsx` builds the client provider and hook on top of
 * these; keeping them apart lets the root entry export them as real functions
 * outside the `'use client'` boundary.
 */

/**
 * Traverse a nested object by dot-path.
 *
 * @example
 * getNestedKey({ cart: { title: 'Cart' } }, 'cart.title') // => 'Cart'
 * getNestedKey({}, 'cart.title', 'fallback')              // => 'fallback'
 *
 * @category Utilities
 */
export function getNestedKey(
  obj: Record<string, unknown>,
  path: string,
  fallback?: string
): string | undefined {
  let keys = path.split('.')
  let current: unknown = obj

  for (let key of keys) {
    if (current == null || typeof current !== 'object') {
      return fallback
    }
    current = (current as Record<string, unknown>)[key]
  }

  if (typeof current === 'string') {
    return current
  }

  return fallback
}

/**
 * Replace `{{variable}}` patterns in a string with provided values.
 *
 * @example
 * interpolate('Hello {{name}}!', { name: 'World' }) // => 'Hello World!'
 * interpolate('-{{percentage}}% Off', { percentage: 15 }) // => '-15% Off'
 *
 * @category Utilities
 */
export function interpolate(
  template: string,
  variables?: Record<string, string | number>
): string {
  if (!variables) {
    return template
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    let value = variables[key]
    return value === undefined ? match : String(value)
  })
}

/**
 * Signature for a translation function.
 */
export type TranslateFunction = (
  key: string,
  variables?: Record<string, string | number>
) => string

/** Translation sources accepted by {@link createTranslate}. */
export interface CreateTranslateSources {
  /** Unsaved live overrides received from Builder design mode. */
  designOverrides?: Record<string, string>
  /** Host application's highest-priority translation function. */
  externalT?: TranslateFunction
  /** Active-locale static-text overrides loaded from Weaverse. */
  merchantOverrides?: Record<string, unknown>
  /** Default-locale static content from the theme schema. */
  staticContent: Record<string, unknown>
}

/**
 * Build the `t()` translation function over a fixed set of sources.
 *
 * Resolution order, highest priority first:
 * 1. `externalT`         – host i18n (e.g. Shopify), unless it echoes the key
 * 2. `designOverrides`   – live design-mode edits, flat dot-path keys
 * 3. `merchantOverrides` – locale overrides from the API, nested
 * 4. `staticContent`     – the theme's default locale JSON
 * 5. the key itself
 *
 * Design overrides are looked up per-key (own properties only) rather than
 * merged into `merchantOverrides`: a flat key like `cart.title` must override
 * exactly that leaf without wiping sibling keys (`cart.subtitle`), and a
 * per-key own-property lookup never builds nested objects from
 * merchant-controlled keys, so it cannot pollute `Object.prototype`.
 *
 * @category Utilities
 */
export function createTranslate(
  sources: CreateTranslateSources
): TranslateFunction {
  let { staticContent, merchantOverrides, designOverrides, externalT } = sources
  return (key, variables) => {
    // Priority 1: external t (e.g. Shopify i18n, third-party library).
    if (externalT) {
      let external = externalT(key, variables)
      // Accept the external value unless it echoed the key unchanged.
      if (external && external !== key) {
        return external
      }
    }

    // Priority 2: live design-mode override (flat, keyed by exact dot-path,
    // own properties only so inherited keys never resolve to functions).
    let design =
      designOverrides && Object.hasOwn(designOverrides, key)
        ? designOverrides[key]
        : undefined
    // Priority 3: merchant overrides (nested). Priority 4: static content.
    let override = merchantOverrides
      ? getNestedKey(merchantOverrides, key)
      : undefined
    let staticValue = getNestedKey(staticContent, key)

    // Priority 5: the key itself as the final fallback.
    let raw = design ?? override ?? staticValue ?? key
    return interpolate(raw, variables)
  }
}
