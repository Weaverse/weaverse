// Import the enhanced data context types and utilities
import type { WeaverseDataContext } from '../hooks/use-weaverse-data-context'
import { isWeaverseDataContext } from '../hooks/use-weaverse-data-context'

// Cached regex pattern for better performance
const TEMPLATE_REGEX = /\{\{([^}]+)\}\}/g
const ARRAY_INDEX_REGEX = /^(\w+)\[(\d+)\]$/

// Simple cache for parsed templates (max 100 entries)
const templateCache = new Map<string, string>()
const MAX_CACHE_SIZE = 100

/**
 * Safely gets a nested value from an object using dot notation path
 * Supports array indexing with [index] syntax
 * @param obj - The object to traverse
 * @param path - Dot notation path (e.g., "user.name" or "items[0].title")
 * @param visited - Set to track visited objects for circular reference protection
 * @returns The resolved value or undefined if not found
 */
function getNestedValue(
  obj: unknown,
  path: string,
  visited = new WeakSet()
): unknown {
  return path.split('.').reduce((current, key) => {
    if (!current || typeof current !== 'object') {
      return
    }

    // Protect against circular references
    if (visited.has(current as WeakKey)) {
      console.warn('Circular reference detected in data connector path:', path)
      return
    }

    // Add to circular reference tracking
    visited.add(current as WeakKey)

    // Handle array indexing like items[0] or items[1]
    const arrayMatch = key.match(ARRAY_INDEX_REGEX)
    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch
      const arrayObj = (current as Record<string, unknown>)[arrayKey]
      if (Array.isArray(arrayObj)) {
        const indexNum = Number.parseInt(index, 10)
        if (indexNum >= 0 && indexNum < arrayObj.length) {
          return arrayObj[indexNum]
        }
      }
      return
    }

    // Handle regular object property access
    return current !== null && key in current
      ? (current as Record<string, unknown>)[key]
      : undefined
  }, obj)
}

/**
 * Sanitizes a string value to prevent XSS attacks
 * @param value - The value to sanitize
 * @returns Sanitized string safe for HTML rendering
 */
function sanitizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // Basic HTML entity encoding to prevent XSS
  return stringValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Creates a safe cache key from content and data
 * Handles circular references by using a simplified approach
 */
function createCacheKey(
  content: string,
  data: Record<string, unknown>
): string {
  try {
    // Try a simple JSON stringification with a limit
    const dataStr = JSON.stringify(data)
    return `${content}:${dataStr.slice(0, 100)}`
  } catch {
    // If JSON.stringify fails (circular references), use a simpler approach
    const keys = Object.keys(data).sort().join(',')
    return `${content}:keys:${keys}`
  }
}

/**
 * Resolves data from either legacy loaderData or enhanced WeaverseDataContext
 * Supports route-specific prefixes like {{root.path}}, {{layout.path}}, etc.
 */
function resolveDataFromContext(
  path: string,
  dataContext: WeaverseDataContext | Record<string, unknown>
): unknown {
  const trimmedPath = path.trim()

  // Check if this is an enhanced context
  if (isWeaverseDataContext(dataContext)) {
    // Handle route-specific prefixes
    if (trimmedPath.startsWith('root.')) {
      return getNestedValue(dataContext.root, trimmedPath.slice(5))
    }
    if (trimmedPath.startsWith('layout.')) {
      return getNestedValue(dataContext.layout, trimmedPath.slice(7))
    }
    if (trimmedPath.startsWith('parent.')) {
      return getNestedValue(dataContext.parent, trimmedPath.slice(7))
    }
    if (trimmedPath.startsWith('current.')) {
      return getNestedValue(dataContext.current, trimmedPath.slice(8))
    }

    // Default to combined data for backward compatibility
    return getNestedValue(dataContext.combined, trimmedPath)
  }

  // Legacy behavior - use data directly
  return getNestedValue(dataContext, trimmedPath)
}

/**
 * Replaces data connector placeholders in content with actual values from data context
 * Supports {{path}} syntax with dot notation, array indexing, and route prefixes
 *
 * Enhanced syntax:
 * - {{root.siteSettings.title}} - Access root route data
 * - {{layout.navigation.items}} - Access layout route data
 * - {{parent.category.name}} - Access parent route data
 * - {{current.product.title}} - Access current route data
 * - {{user.name}} - Auto-resolved from combined data (backward compatible)
 *
 * @param content - The content string containing {{}} placeholders
 * @param dataContext - The data context (legacy loaderData or enhanced WeaverseDataContext)
 * @returns The content with placeholders replaced by actual values
 */
export function replaceContentDataConnectors(
  content: string,
  dataContext: WeaverseDataContext | Record<string, unknown> | null | undefined
): string {
  if (!dataContext || typeof content !== 'string') {
    return content
  }

  try {
    // Use combined data for caching (handles both legacy and enhanced formats)
    const cacheData = isWeaverseDataContext(dataContext)
      ? dataContext.combined
      : dataContext
    const cacheKey = createCacheKey(content, cacheData)

    if (templateCache.has(cacheKey)) {
      return templateCache.get(cacheKey)!
    }

    const newContent = content.replace(TEMPLATE_REGEX, (match, path) => {
      try {
        const value = resolveDataFromContext(path, dataContext)

        if (value === undefined || value === null) {
          return match // Return original placeholder if value not found
        }

        return sanitizeValue(value)
      } catch (pathError) {
        console.warn(
          `Error resolving data connector path "${path}":`,
          pathError
        )
        return match
      }
    })

    // Cache the result (with size limit)
    if (templateCache.size >= MAX_CACHE_SIZE) {
      const firstKey = templateCache.keys().next().value
      templateCache.delete(firstKey)
    }
    templateCache.set(cacheKey, newContent)

    return newContent
  } catch (error) {
    console.warn('Error processing data connectors:', error, { content })
    return content
  }
}
