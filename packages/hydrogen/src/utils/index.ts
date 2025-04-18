import type { HydrogenEnv } from '@shopify/hydrogen'
import type {
  HydrogenComponent,
  HydrogenComponentSchema,
  HydrogenThemeSchema,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from '../types'

export function getRequestQueries<T = Record<string, string | boolean>>(
  request: Request,
) {
  let url = new URL(request.url)
  return Array.from(url.searchParams.entries()).reduce(
    (q: Record<string, unknown>, [k, v]) => {
      q[k] = v === 'true' ? true : v === 'false' ? false : v
      return q
    },
    {},
  ) as T
}

export function getWeaverseConfigs(
  request: Request,
  env: HydrogenEnv,
): WeaverseProjectConfigs {
  let queries = getRequestQueries<WeaverseStudioQueries>(request)
  let {
    WEAVERSE_PROJECT_ID,
    WEAVERSE_API_KEY,
    WEAVERSE_HOST,
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
      WEAVERSE_HOST ||
      weaverseHost ||
      envFromProcess.WEAVERSE_HOST ||
      'https://studio.weaverse.io',
    weaverseApiKey:
      weaverseApiKey ||
      WEAVERSE_API_KEY ||
      envFromProcess.WEAVERSE_API_KEY ||
      '',
    weaverseVersion: weaverseVersion || '',
    isDesignMode: isDesignMode || false,
    isPreviewMode: isPreviewMode || false,
    sectionType: sectionType || '',
    publicEnv: {
      PUBLIC_STORE_DOMAIN: PUBLIC_STORE_DOMAIN || '',
      PUBLIC_STOREFRONT_API_TOKEN: PUBLIC_STOREFRONT_API_TOKEN || '',
    },
  }
}

export function generateDataFromSchema(
  schema: HydrogenComponentSchema | HydrogenThemeSchema,
) {
  let data: Record<string, any> = {}
  let inspector = schema?.inspector
  if (inspector) {
    for (let group of inspector) {
      for (let input of group.inputs) {
        let { name, defaultValue } = input
        if (name && defaultValue !== null && defaultValue !== undefined) {
          data[name] = defaultValue
        }
      }
    }
  }
  return data
}

function recursivelyAddDataItem(
  type: string,
  components: HydrogenComponent<any>[],
  items: any[],
  initData?: object,
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
      childIds.push({ id: childId })
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
  weaverseHost: string,
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
      id: '0',
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
