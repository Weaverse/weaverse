import type { PageType } from '@weaverse/schema'
import { PageTypeSchema } from '@weaverse/schema'
import type {
  WeaverseNextComponentData,
  WeaverseNextI18n,
  WeaverseNextRequestInfo,
} from './types'

export const DEFAULT_REVALIDATE_ENDPOINT = '/api/weaverse/revalidate'

const MAX_ROUTE_CONTEXT_HANDLE_LENGTH = 512

/**
 * Server-owned and transient controls stripped from the revalidation route
 * context on both sides of the trust boundary. Compared case-insensitively, so
 * every entry is stored lowercased. Client sanitization keeps normal traffic
 * clean; the route handler repeats this deny-list as the security boundary.
 *
 * - Server-owned: a crafted `?weaverseProjectId=`/`?weaverseHost=`/`?weaverseApiKey=`
 *   must never influence server config resolution (see `getWeaverseNextConfigs`).
 * - Transient: draft-item and RSC transport params never describe route identity.
 */
export const DENIED_ROUTE_CONTEXT_PARAMS = [
  'weaverseprojectid',
  'weaversehost',
  'weaverseapikey',
  'weaverseapibase',
  'weaversepublicapibase',
  'weaverseversion',
  'projectid',
  'weaversedraftitem',
  '__weaversedraftitem',
  '_rsc',
]

/** i18n fields allowed to cross the browser boundary. */
export const ROUTE_CONTEXT_I18N_KEYS = [
  'country',
  'label',
  'language',
  'locale',
  'pathPrefix',
] as const

/**
 * JSON-safe route subset that may cross the browser boundary alongside the
 * draft item. Never carries headers, cookies, auth, env, project ID, Studio
 * host, API keys/bases, commerce clients, the request context, runtime, or
 * client. `search` is canonical (preserves duplicate keys); the derived
 * `queries` record is intentionally omitted.
 */
export interface WeaverseNextRevalidateRouteContext {
  handle?: string
  i18n?: Pick<
    WeaverseNextI18n,
    'country' | 'label' | 'language' | 'locale' | 'pathPrefix'
  >
  pageType?: PageType
  pathname: string
  search: string
}

/**
 * Minimal runtime surface the in-place apply needs. Structural (not the
 * concrete `WeaverseNextRuntime` class) so unit tests can drive it with a
 * plain mock. `requestInfo` stays optional: a real `WeaverseNextRuntime`
 * always supplies it, but when absent the client omits `routeContext` and the
 * legacy `{ draftItem }` request is preserved.
 */
export interface RevalidateItemRuntimeLike {
  itemInstances: Map<
    string,
    {
      setData: (update: Record<string, unknown>) => unknown
    }
  >
  requestInfo?: WeaverseNextRequestInfo
}

/**
 * Strip denied (server-owned/transient) controls from a `search` string and
 * re-serialize it. Preserves ordinary application queries, duplicate keys,
 * encoded Unicode, and mode controls (`isDesignMode`, `isPreviewMode`,
 * `__revisionId`, `sectionType`). Returns `''` or a `?`-prefixed string.
 */
export function sanitizeRouteContextSearch(search: string): string {
  let params = new URLSearchParams(search)
  let denied = new Set(DENIED_ROUTE_CONTEXT_PARAMS)
  for (let key of [...new Set(params.keys())]) {
    if (denied.has(key.toLowerCase())) {
      params.delete(key)
    }
  }
  let serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

/**
 * Build the sanitized {@link WeaverseNextRevalidateRouteContext} from the
 * active runtime's request info. Returns `undefined` without a usable pathname
 * so the caller omits `routeContext` and keeps the legacy request. This is not
 * the security boundary — the route handler re-validates and re-sanitizes.
 */
export function buildWeaverseNextRevalidateRouteContext(
  requestInfo?: WeaverseNextRequestInfo
): WeaverseNextRevalidateRouteContext | undefined {
  if (
    !requestInfo ||
    typeof requestInfo.pathname !== 'string' ||
    !requestInfo.pathname
  ) {
    return
  }

  let routeContext: WeaverseNextRevalidateRouteContext = {
    pathname: requestInfo.pathname,
    search: sanitizeRouteContextSearch(requestInfo.search ?? ''),
  }

  let { i18n } = requestInfo
  if (i18n && typeof i18n === 'object') {
    let picked: Record<string, string> = {}
    for (let key of ROUTE_CONTEXT_I18N_KEYS) {
      let value = i18n[key]
      if (typeof value === 'string') {
        picked[key] = value
      }
    }
    if (Object.keys(picked).length) {
      routeContext.i18n = picked
    }
  }

  if (
    requestInfo.pageType &&
    PageTypeSchema.safeParse(requestInfo.pageType).success
  ) {
    routeContext.pageType = requestInfo.pageType
  }

  if (
    typeof requestInfo.handle === 'string' &&
    requestInfo.handle &&
    requestInfo.handle.length <= MAX_ROUTE_CONTEXT_HANDLE_LENGTH
  ) {
    routeContext.handle = requestInfo.handle
  }

  return routeContext
}

/**
 * Studio per-item loader revalidation: POST the unsaved draft item (and, when
 * the runtime exposes route context, a sanitized `routeContext`) to the app's
 * revalidate route (see `createWeaverseNextRevalidateHandler`) and apply the
 * returned `loaderData` to the live item instance in place.
 *
 * No `router.refresh()` is involved, so the RSC tree is never re-applied — no
 * page remount, no scroll reset, and the draft payload never touches the URL.
 *
 * Throws on any failure (missing route, non-OK response, unknown item) so the
 * Builder Studio bridge can detect the miss and fall back to its legacy
 * refresh-based revalidation for this window.
 */
export async function revalidateWeaverseNextItem(
  runtime: RevalidateItemRuntimeLike,
  draftItem: WeaverseNextComponentData,
  endpoint: string = DEFAULT_REVALIDATE_ENDPOINT
): Promise<void> {
  let instance = runtime.itemInstances.get(draftItem.id)
  if (!instance) {
    throw new Error(
      `[weaverse-next] No live item instance for "${draftItem.id}".`
    )
  }

  // Snapshot route identity at revalidation start so a later navigation cannot
  // retarget this in-flight request. Omit `routeContext` for legacy runtimes.
  let routeContext = buildWeaverseNextRevalidateRouteContext(
    runtime.requestInfo
  )
  let body = routeContext ? { draftItem, routeContext } : { draftItem }

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(
      `[weaverse-next] Revalidate endpoint responded ${response.status}.`
    )
  }

  let { loaderData } = (await response.json()) as { loaderData?: unknown }
  // The item's settings were already mutated by the Studio edit; only the
  // loader payload needs applying. `setData` merges and notifies subscribers,
  // and the new `loaderData` identity is what Builder's revalidation poll
  // observes for completion.
  instance.setData({ loaderData: loaderData ?? null })
}
