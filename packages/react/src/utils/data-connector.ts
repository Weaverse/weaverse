// Data connector utilities for replacing placeholders with real data
// Generic data context type for flexible usage
export type DataContext = Record<string, unknown>

// Cached regex pattern for better performance
const TEMPLATE_REGEX = /\{\{([^}]+)\}\}/g
const ARRAY_INDEX_REGEX = /^(\w+)\[(\d+)\]$/

/**
 * Validates that a property name is safe to access (prevents prototype pollution)
 * Enhanced to handle route-specific patterns with special characters
 */
function isSafePropertyName(key: string): boolean {
  // Block dangerous prototype pollution patterns
  const dangerousPatterns = ['__proto__', 'constructor', 'prototype']
  return !dangerousPatterns.includes(key)
}

/**
 * Parses a template path into route key and property path components
 * Handles complex routes like: routes/($locale).blogs.$blogHandle.$articleHandle
 * Enhanced with caching for improved performance
 *
 * @param path - The full path from template (e.g., "routes/($locale)._index.weaverseData.page.name")
 * @param dataContext - Available route data context
 * @returns Object with routeKey and propertyPath
 */
function parseRouteAndProperty(
  path: string,
  dataContext: DataContext
): {
  routeKey: string | null
  propertyPath: string
} {
  if (!dataContext || typeof path !== 'string') {
    return { routeKey: null, propertyPath: path }
  }

  const trimmedPath = path.trim()

  // Create a cache key that includes available routes for context awareness
  const availableRouteKeys = Object.keys(dataContext).sort().join('|')
  const cacheKey = `${trimmedPath}::${availableRouteKeys}`

  // Check cache first
  const cachedResult = routeParsingCache.get(cacheKey)
  if (cachedResult) {
    // Update timestamp on cache hit
    cachedResult.timestamp = Date.now()
    return {
      routeKey: cachedResult.routeKey,
      propertyPath: cachedResult.propertyPath,
    }
  }

  // Get all available routes and sort by length (longest first for specificity)
  const availableRoutes = Object.keys(dataContext).sort(
    (a, b) => b.length - a.length
  )

  let result: { routeKey: string | null; propertyPath: string } = {
    routeKey: null,
    propertyPath: trimmedPath,
  }

  // Try to find the longest matching route key
  let found = false
  for (const routeKey of availableRoutes) {
    // Exact match
    if (trimmedPath === routeKey) {
      result = { routeKey, propertyPath: '' }
      found = true
      break
    }

    // Route key with property path
    if (trimmedPath.startsWith(routeKey + '.')) {
      const propertyPath = trimmedPath.substring(routeKey.length + 1)
      result = { routeKey, propertyPath }
      found = true
      break
    }
  }

  if (!found) {
    // No route key found, treat entire path as property path
    result = { routeKey: null, propertyPath: trimmedPath }
  }

  // Cache the result
  if (routeParsingCache.size >= ROUTE_PARSING_CACHE_MAX_SIZE) {
    // Clean cache by removing oldest entries
    const entries = Array.from(routeParsingCache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toRemove = Math.floor(entries.length * 0.25)
    for (let i = 0; i < toRemove; i++) {
      routeParsingCache.delete(entries[i][0])
    }
  }

  routeParsingCache.set(cacheKey, {
    routeKey: result.routeKey,
    propertyPath: result.propertyPath,
    timestamp: Date.now(),
  })

  return result
}

// Simple cache for parsed templates (max 100 entries)
const templateCache = new Map<string, string>()
const MAX_CACHE_SIZE = 100

// Cache for fallback lookups to improve performance (moved to module level to prevent memory leaks)
const fallbackCache = new Map<
  string,
  { routeKey: string; value: unknown; timestamp: number }
>()
const FALLBACK_CACHE_MAX_SIZE = 50

// Route parsing cache for performance optimization
const routeParsingCache = new Map<
  string,
  { routeKey: string | null; propertyPath: string; timestamp: number }
>()
const ROUTE_PARSING_CACHE_MAX_SIZE = 100

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

    // Handle regular object property access with security validation
    if (!isSafePropertyName(key)) {
      console.warn(`Unsafe property access attempted: ${key}`)
      return
    }

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
 * Resolves data from the flat route-keyed data context
 * Enhanced to support complex route patterns with special characters
 * Supports: {{root.layout.shop.name}}, {{routes/($locale)._index.data}}, {{routes/($locale).blogs.$handle.$article.content}}
 */
function resolveDataFromContext(
  path: string,
  dataContext: DataContext | null | undefined
): unknown {
  if (!dataContext) {
    return
  }

  const trimmedPath = path.trim()

  // Use intelligent route parsing to separate route key from property path
  const { routeKey, propertyPath } = parseRouteAndProperty(
    trimmedPath,
    dataContext
  )

  // If we found a specific route key, resolve from that route's data
  if (routeKey && dataContext[routeKey]) {
    const routeData = dataContext[routeKey]
    if (typeof routeData === 'object' && routeData !== null) {
      if (propertyPath) {
        return getNestedValue(routeData, propertyPath)
      }
      return routeData
    }
  }

  // Fallback: search across all route data for backward compatibility
  // This handles cases like {{shop.name}} without route prefix

  // Check cache first
  const cachedResult = fallbackCache.get(trimmedPath)
  if (cachedResult && dataContext[cachedResult.routeKey]) {
    const value = getNestedValue(
      dataContext[cachedResult.routeKey],
      trimmedPath
    )
    if (value !== undefined) {
      // Update timestamp on cache hit
      cachedResult.timestamp = Date.now()
      return value
    }
  }

  // Search with priority order (most common routes first)
  const priorityRoutes = ['root', 'routes/product', 'routes/collection']
  const allRoutes = [
    ...priorityRoutes,
    ...Object.keys(dataContext).filter((k) => !priorityRoutes.includes(k)),
  ]

  for (const routeKey of allRoutes) {
    const routeData = dataContext[routeKey]
    if (routeData && typeof routeData === 'object' && routeData !== null) {
      const value = getNestedValue(routeData, trimmedPath)
      if (value !== undefined) {
        // Clean cache if it's getting too large
        if (fallbackCache.size >= FALLBACK_CACHE_MAX_SIZE) {
          const entries = Array.from(fallbackCache.entries())
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
          // Remove oldest 25% of entries
          const toRemove = Math.floor(entries.length * 0.25)
          for (let i = 0; i < toRemove; i++) {
            fallbackCache.delete(entries[i][0])
          }
        }
        fallbackCache.set(trimmedPath, {
          routeKey,
          value,
          timestamp: Date.now(),
        })
        return value
      }
    }
  }

  // Final fallback: try direct access (for non-route-keyed legacy data)
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
 * @param dataContext - The enhanced WeaverseDataContext with route-keyed data
 * @returns The content with placeholders replaced by actual values
 */
export function replaceContentDataConnectors(
  content: string,
  dataContext: DataContext | null | undefined
): string {
  if (!dataContext || typeof content !== 'string') {
    return content
  }

  try {
    // Simplified caching - dataContext is already the combined data
    const cacheKey = createCacheKey(content, dataContext)

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

/**
 * Recursively replaces data connector placeholders in any data structure
 * IMMUTABLE: Creates deep copies during processing to avoid mutating original data
 * Handles strings, objects, arrays, and nested combinations
 *
 * @param data - The data to process (string, object, array, or primitive)
 * @param dataContext - The data context for replacements
 * @param visited - Set to track visited objects for circular reference protection
 * @returns IMMUTABLE copy of the data with all string placeholders replaced
 */
export function replaceContentDataConnectorsDeep<T>(
  data: T,
  dataContext: DataContext | null | undefined,
  visited = new WeakSet()
): T {
  if (!dataContext) {
    return data
  }

  // Handle primitive types - no cloning needed for primitives
  if (typeof data === 'string') {
    return replaceContentDataConnectors(data, dataContext) as T
  }

  if (typeof data !== 'object' || data === null) {
    return data
  }

  // Protect against circular references
  if (visited.has(data as WeakKey)) {
    console.warn(
      'Circular reference detected in deep data connector replacement'
    )
    return data
  }

  // Add to circular reference tracking
  visited.add(data as WeakKey)

  try {
    // Handle special objects that should be cloned as-is
    if (data instanceof Date) {
      return new Date(data.getTime()) as T
    }

    // Handle arrays - create new array with processed items
    if (Array.isArray(data)) {
      const result = data.map((item) =>
        replaceContentDataConnectorsDeep(item, dataContext, visited)
      ) as T
      return result
    }

    // Handle plain objects - create new object with processed values
    const result = {} as T
    for (const [key, value] of Object.entries(data)) {
      ;(result as Record<string, unknown>)[key] =
        replaceContentDataConnectorsDeep(value, dataContext, visited)
    }

    return result
  } catch (error) {
    console.warn('Error in deep data connector replacement:', error)
    return data
  } finally {
    // Remove from tracking when done processing this object
    visited.delete(data as WeakKey)
  }
}
