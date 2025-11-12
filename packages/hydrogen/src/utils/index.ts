import type { HydrogenEnv } from '@shopify/hydrogen'
import type {
  HydrogenComponent,
  HydrogenComponentSchema,
  HydrogenThemeSchema,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from '../types'

// Track warned types to avoid spam
let warnedTypes = new Set<string>()

function logOnce(type: string, message: string) {
  if (!warnedTypes.has(type)) {
    console.warn(message)
    warnedTypes.add(type)
  }
}

function deepMergeArrays<T>(target: T[], source: T[]): T[] {
  return [...target, ...source]
}

function mergeInspectorSettings(
  settings: any[],
  inspector: any[],
  type: string
): any[] {
  if (!inspector?.length) {
    return settings
  }
  if (!settings?.length) {
    return inspector
  }

  // Log collision notice
  console.info(
    `Schema "${type}": Both 'settings' and 'inspector' found. Using 'settings' with 'inspector' as fallback.`
  )

  return deepMergeArrays(settings, inspector)
}

/**
 * Extract and parse query parameters from a request URL.
 * Supports optional allowlist for security-sensitive applications.
 *
 * @param request - The incoming request
 * @param options - Optional configuration
 * @param options.allowedKeys - If provided, only these keys will be extracted
 * @returns Parsed query parameters with type coercion for booleans
 *
 * @example
 * ```typescript
 * // Extract all params
 * const queries = getRequestQueries(request)
 *
 * // Extract only allowed params (security-sensitive)
 * const queries = getRequestQueries(request, {
 *   allowedKeys: ['weaverseProjectId', 'weaverseHost']
 * })
 * ```
 */
export function getRequestQueries<T = Record<string, string | boolean>>(
  request: Request,
  options?: { allowedKeys?: string[] }
): T {
  let url = new URL(request.url)
  let queries: Record<string, unknown> = {}

  for (let [key, value] of url.searchParams.entries()) {
    // If allowlist provided, skip non-allowed keys
    if (options?.allowedKeys && !options.allowedKeys.includes(key)) {
      continue
    }

    // Type-safe conversion for known boolean patterns
    if (value === 'true') {
      queries[key] = true
    } else if (value === 'false') {
      queries[key] = false
    } else {
      queries[key] = value
    }
  }

  return queries as T
}

export function getWeaverseConfigs(
  request: Request,
  env: HydrogenEnv
): WeaverseProjectConfigs {
  let queries = getRequestQueries<WeaverseStudioQueries>(request)
  let {
    WEAVERSE_PROJECT_ID,
    WEAVERSE_API_KEY,
    WEAVERSE_HOST,
    WEAVERSE_API_BASE,
    PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_API_TOKEN,
  } = env || {}
  let envFromProcess = (typeof process !== 'undefined' && process.env) || {}
  let {
    weaverseProjectId,
    weaverseHost,
    isDesignMode,
    isPreviewMode,
    sectionType,
    weaverseVersion,
    weaverseApiKey,
  } = queries
  return {
    projectId:
      weaverseProjectId ||
      WEAVERSE_PROJECT_ID ||
      envFromProcess.WEAVERSE_PROJECT_ID ||
      '',
    weaverseHost:
      weaverseHost ||
      WEAVERSE_HOST ||
      envFromProcess.WEAVERSE_HOST ||
      'https://studio.weaverse.io',
    weaverseApiBase:
      WEAVERSE_API_BASE ||
      envFromProcess.WEAVERSE_API_BASE ||
      WEAVERSE_HOST ||
      envFromProcess.WEAVERSE_HOST ||
      'https://api.weaverse.io',
    weaverseApiKey:
      weaverseApiKey ||
      WEAVERSE_API_KEY ||
      envFromProcess.WEAVERSE_API_KEY ||
      '',
    weaverseVersion: weaverseVersion || '',
    isDesignMode,
    isPreviewMode,
    sectionType: sectionType || '',
    publicEnv: {
      PUBLIC_STORE_DOMAIN: PUBLIC_STORE_DOMAIN || '',
      PUBLIC_STOREFRONT_API_TOKEN: PUBLIC_STOREFRONT_API_TOKEN || '',
    },
  }
}

/**
 * Cache for generateDataFromSchema results using WeakMap.
 * WeakMap allows garbage collection when schema objects are no longer referenced.
 */
const schemaDefaultsCache = new WeakMap<
  HydrogenComponentSchema | HydrogenThemeSchema,
  Record<string, any>
>()

/**
 * Generate default data from component or theme schema.
 * Results are memoized using WeakMap for performance.
 *
 * @param schema - Component or theme schema
 * @returns Default data object extracted from schema inputs
 */
export function generateDataFromSchema(
  schema: HydrogenComponentSchema | HydrogenThemeSchema
) {
  // Check cache first for performance
  const cached = schemaDefaultsCache.get(schema)
  if (cached) {
    return cached
  }

  let data: Record<string, any> = {}

  // Handle migration from inspector to settings
  let inspectorGroups: any[] = []

  // Type guard to check if it's a component schema
  const isComponentSchema = (
    s: HydrogenComponentSchema | HydrogenThemeSchema
  ): s is HydrogenComponentSchema => 'type' in s && typeof s.type === 'string'

  if (isComponentSchema(schema)) {
    // Handle HydrogenComponentSchema
    if (schema.settings) {
      inspectorGroups = schema.settings
    }

    if (schema.inspector) {
      if (schema.settings?.length) {
        // Both exist - merge with settings taking priority
        inspectorGroups = mergeInspectorSettings(
          schema.settings,
          schema.inspector,
          schema.type || 'unknown'
        )
      } else {
        // Only inspector exists - use it but warn about deprecation
        inspectorGroups = schema.inspector
        if (schema.type) {
          logOnce(
            schema.type,
            `⚠️  Schema "${schema.type}": The 'inspector' property is deprecated. Please use 'settings' instead.`
          )
        }
      }
    }
  } else {
    // Handle HydrogenThemeSchema
    if (schema.settings) {
      inspectorGroups = schema.settings
    }

    if (schema.inspector) {
      if (schema.settings?.length) {
        // Both exist - merge with settings taking priority
        inspectorGroups = mergeInspectorSettings(
          schema.settings,
          schema.inspector,
          'Theme Schema'
        )
      } else {
        // Only inspector exists - use it but warn about deprecation
        inspectorGroups = schema.inspector
        logOnce(
          'ThemeSchema',
          `⚠️  Theme Schema: The 'inspector' property is deprecated. Please use 'settings' instead.`
        )
      }
    }
  }

  if (inspectorGroups?.length) {
    for (let group of inspectorGroups) {
      for (let input of group.inputs) {
        let { name, defaultValue } = input
        if (name && defaultValue !== null && defaultValue !== undefined) {
          data[name] = defaultValue
        }
      }
    }
  }

  // Cache the result before returning
  schemaDefaultsCache.set(schema, data)

  return data
}

function recursivelyAddDataItem(
  type: string,
  components: HydrogenComponent<any>[],
  items: any[],
  initData?: object
) {
  let component = components.find((c) => c.schema.type === type)
  if (!component) {
    return
  }
  let childIds = []
  let id = crypto.randomUUID()
  let { children, ...data } = component.schema?.presets || {}
  if (children) {
    for (let c of children) {
      let { type, children, ...data } = c
      let childId = recursivelyAddDataItem(type, components, items, data)
      childIds.push({ id: childId } as never)
    }
  }
  items.push({
    data: { ...data, ...initData },
    id,
    type,
    children: childIds,
  })
  return id
}

export function getPreviewData(
  type: string,
  components: HydrogenComponent[],
  weaverseHost: string
) {
  let items = []
  return {
    project: { id: 'x', weaverseShopId: 'shop-id', name: 'Section Preview' },
    configs: {
      projectId: 'x',
      weaverseHost,
      isDesignMode: false,
      isPreviewMode: true,
      requestInfo: {
        i18n: {
          label: 'United States (USD $)',
          language: 'EN',
          country: 'US',
          currency: 'USD',
          pathPrefix: '',
        },
        queries: {},
        pathname: '/',
        search: '',
      },
    },
    page: {
      id: 'weaverse-preview-page',
      name: 'Preview section',
      rootId: '1',
      items: [
        {
          data: {},
          id: '1',
          type: 'main',
          children: [{ id: recursivelyAddDataItem(type, components, items) }],
        },
        ...items,
      ],
    },
  } as unknown as WeaverseLoaderData
}
