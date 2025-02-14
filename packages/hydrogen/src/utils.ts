import type { HydrogenEnv } from '@shopify/hydrogen'
import type {
  HydrogenComponent,
  HydrogenComponentSchema,
  HydrogenThemeSchema,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from './types'

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

export function generateDataFromSchema({
  inspector,
}: HydrogenComponentSchema | HydrogenThemeSchema) {
  let data: Record<string, any> = {}
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

/**
 * Resize an image to the specified dimensions.
 *
 * @param imageURL {string} URL of the image
 * @param size {string} Shopify size attribute
 * @returns {string} URL with size attribute
 *
 * @example
 * resizeImage('https://cdn.shopify.com/image.jpg', '100x')
 * resizeImage('https://cdn.shopify.com/image.jpg', '100x100')
 */
export function resizeShopifyImage(imageURL: string, size: string): string {
  try {
    if (!imageURL.includes('cdn.shopify.com') || size === 'original') {
      return imageURL
    }
    let [, path, ext] = imageURL.match(/(.*\/[\w-_.]+)\.(\w{2,4})/)
    return `${path}_${size}.${ext}`
  } catch (e) {
    return imageURL
  }
}

export function recursivelyAddDataItem(
  type: string,
  components: HydrogenComponent<any>[],
  items: any[],
  initData?: object,
) {
  const component = components.find((c) => c.schema.type === type)
  if (!component) {
    return
  }
  let childIDs = []
  // generate id for item
  const id = crypto.randomUUID()
  const { children, ...data } = component.schema?.presets || {}
  if (children) {
    for (const child of children) {
      const { type, children, ...data } = child
      const childID = recursivelyAddDataItem(
        child.type,
        components,
        items,
        data,
      )
      childIDs.push({
        id: childID,
      })
    }
  }
  items.push({
    data: { ...data, ...initData },
    id,
    type,
    children: childIDs,
  })
  return id
}

export function getPreviewData(type: string, components, weaverseHost: string) {
  const initialData = {
    project: {
      id: 'x',
      weaverseShopId: 'shopid',
      name: 'Section Preview',
    },
    // pageAssignment: {
    //   projectId: "x",
    //   type: "CUSTOM",
    //   locale: "en-us",
    //   handle: "",
    // },
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
  }
  let items = []
  const id = recursivelyAddDataItem(type, components, items)
  const page = {
    id: '0',
    name: 'Preview section',
    rootId: '1',
    items: [
      {
        data: {},
        id: '1',
        type: 'main',
        children: [
          {
            id,
          },
        ],
      },
      ...items,
    ],
  }
  const previewData = {
    ...initialData,
    page,
  }
  return previewData
}
