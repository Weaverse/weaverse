import type {
  HydrogenThemeEnv,
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
  env: HydrogenThemeEnv,
): WeaverseProjectConfigs {
  let queries = getRequestQueries<WeaverseStudioQueries>(request)
  let {
    WEAVERSE_PROJECT_ID,
    WEAVERSE_API_KEY,
    WEAVERSE_HOST,
    PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_API_TOKEN,
  } = env || {}
  let { weaverseProjectId, weaverseHost, isDesignMode, weaverseVersion,weaverseApiKey } =
    queries
  return {
    projectId: weaverseProjectId || WEAVERSE_PROJECT_ID || process?.env?.WEAVERSE_PROJECT_ID || '',
    weaverseHost: weaverseHost || WEAVERSE_HOST || process?.env?.WEAVERSE_HOST || 'https://weaverse.io',
    weaverseApiKey: weaverseApiKey || WEAVERSE_API_KEY || process?.env?.WEAVERSE_API_KEY || '',
    weaverseVersion: weaverseVersion || '',
    isDesignMode: isDesignMode || false,
    publicEnv: {
      PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_TOKEN,
    },
  }
}
