import type { PageType } from '@weaverse/schema'
import { PageTypeSchema } from '@weaverse/schema'
import {
  ROUTE_CONTEXT_I18N_KEYS,
  sanitizeRouteContextSearch,
  type WeaverseNextRevalidateRouteContext,
} from '../revalidate-item'
import type {
  WeaverseNextComponentData,
  WeaverseNextI18n,
  WeaverseNextRequestContext,
  WeaverseNextServerClient,
} from '../types'
import { generateDataFromSchema } from '../utils'

const NO_STORE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
} as const

const STATUS_OK = 200
const STATUS_BAD_REQUEST = 400
const STATUS_NOT_FOUND = 404
const STATUS_UNPROCESSABLE = 422
const STATUS_SERVER_ERROR = 500

const MAX_PATHNAME_LENGTH = 2048
const MAX_SEARCH_LENGTH = 8192
const MAX_HANDLE_LENGTH = 512
const MAX_I18N_FIELD_LENGTH = 256
// ASCII control characters (C0 range + DEL) are never valid in a route path.
// biome-ignore lint/suspicious/noControlCharactersInRegex: rejecting control chars in untrusted pathnames is the intent.
const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/

export interface WeaverseNextRevalidateHandlerConfig {
  /**
   * Reuse the app's server-client factory so the loader runs with the same
   * component registry and commerce (storefront) context as page loads.
   *
   * The optional second argument is the validated, same-origin route context
   * reconstructed from the request body. It is `undefined` for legacy bodies
   * that carry no `routeContext`, so a one-argument `(request) => client`
   * callback remains valid. Consumers must still source project ID, Studio
   * host, API bases/keys, and env from server config — never from this
   * browser-provided context.
   */
  getClient: (
    request: Request,
    requestContext?: WeaverseNextRequestContext
  ) => Promise<WeaverseNextServerClient> | WeaverseNextServerClient
}

/** POST body accepted by the revalidate route. */
export interface WeaverseNextRevalidateRequestBody {
  draftItem: WeaverseNextComponentData
  routeContext?: WeaverseNextRevalidateRouteContext
}

/**
 * Whether a browser-provided pathname is safe to reconstruct a same-origin URL
 * from. Rejects protocol-relative (`//`), absolute-URL, backslash, control
 * character, query-in-path, and fragment-in-path inputs before any URL is
 * built. Literal/encoded dot segments are allowed here and normalized later by
 * the URL pathname setter.
 */
function isValidPathname(pathname: string): boolean {
  if (!pathname || pathname.length > MAX_PATHNAME_LENGTH) {
    return false
  }
  if (pathname[0] !== '/' || pathname.startsWith('//')) {
    return false
  }
  if (pathname.includes('\\') || pathname.includes('?')) {
    return false
  }
  if (pathname.includes('#') || CONTROL_CHAR_PATTERN.test(pathname)) {
    return false
  }
  return true
}

/**
 * Whether a value is a plain object (literal or `null`-prototype), the only
 * i18n container the wire shape allows. Arrays, class instances, and other
 * exotic objects are rejected so nothing exotic reaches field validation.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }
  let proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Validate and pick the allowed i18n fields. Returns `undefined` for a valid
 * empty result and `null` for malformed input so the handler can fail closed.
 *
 * The normative i18n shape carries only the {@link ROUTE_CONTEXT_I18N_KEYS}.
 * Malformed input is rejected rather than silently narrowed: any unknown own
 * key (nested object, extra string, anything), a non-plain container (array,
 * class instance), or a known key whose value is not an optional string of at
 * most {@link MAX_I18N_FIELD_LENGTH} characters fails closed.
 */
function sanitizeRouteContextI18n(
  input: unknown
): WeaverseNextI18n | undefined | null {
  if (input === undefined) {
    return
  }
  if (!isPlainObject(input)) {
    return null
  }
  let source = input
  let allowed = new Set<string>(ROUTE_CONTEXT_I18N_KEYS)
  // Reject unknown own keys instead of dropping them, so a crafted context
  // cannot smuggle extra properties past the trust boundary.
  for (let key of Object.keys(source)) {
    if (!allowed.has(key)) {
      return null
    }
  }
  let result: Record<string, string> = {}
  for (let key of ROUTE_CONTEXT_I18N_KEYS) {
    let value = source[key]
    if (value === undefined) {
      continue
    }
    if (typeof value !== 'string' || value.length > MAX_I18N_FIELD_LENGTH) {
      return null
    }
    result[key] = value
  }
  return Object.keys(result).length ? result : undefined
}

/**
 * Reconstruct a validated, same-origin {@link WeaverseNextRequestContext} from
 * the untrusted route context. Returns `null` for any malformed field so the
 * handler can answer `400 invalid-route-context` before creating a client. The
 * endpoint origin is fixed first, then validated components are assigned, so
 * the browser cannot change protocol, host, port, or credentials.
 */
function reconstructRouteContext(
  request: Request,
  routeContext: unknown
): WeaverseNextRequestContext | null {
  if (
    typeof routeContext !== 'object' ||
    routeContext === null ||
    Array.isArray(routeContext)
  ) {
    return null
  }
  let { pathname, search, handle, pageType, i18n } = routeContext as Record<
    string,
    unknown
  >

  if (typeof pathname !== 'string' || !isValidPathname(pathname)) {
    return null
  }

  if (typeof search !== 'string' || search.length > MAX_SEARCH_LENGTH) {
    return null
  }
  let rawSearch = search
  if (rawSearch.length && !rawSearch.startsWith('?')) {
    return null
  }

  let sanitizedI18n = sanitizeRouteContextI18n(i18n)
  if (sanitizedI18n === null) {
    return null
  }

  let resolvedPageType: PageType | undefined
  if (pageType !== undefined) {
    let parsed = PageTypeSchema.safeParse(pageType)
    if (!parsed.success) {
      return null
    }
    resolvedPageType = parsed.data
  }

  let resolvedHandle: string | undefined
  if (handle !== undefined) {
    if (
      typeof handle !== 'string' ||
      !handle ||
      handle.length > MAX_HANDLE_LENGTH
    ) {
      return null
    }
    resolvedHandle = handle
  }

  // Fix the endpoint origin first, then assign validated components. Reuse the
  // URL's canonical pathname in both context fields so raw input never survives
  // in only one place.
  let endpointUrl = new URL(request.url)
  let routeUrl = new URL(endpointUrl.origin)
  routeUrl.pathname = pathname
  routeUrl.search = sanitizeRouteContextSearch(rawSearch)
  let canonicalPathname = routeUrl.pathname
  let searchParams = routeUrl.searchParams

  // Last value wins for duplicated Studio controls, matching
  // `getWeaverseNextConfigs()` and its cache-mode resolution.
  let lastParam = (key: string): string | undefined => {
    let values = searchParams.getAll(key)
    return values.length ? values.at(-1) : undefined
  }

  return {
    pathname: canonicalPathname,
    searchParams,
    url: routeUrl,
    // Headers come from the actual same-origin POST, never its JSON body.
    headers: new Headers(request.headers),
    ...(sanitizedI18n ? { i18n: sanitizedI18n } : {}),
    ...(resolvedPageType ? { pageType: resolvedPageType } : {}),
    ...(resolvedHandle ? { handle: resolvedHandle } : {}),
    isDesignMode: lastParam('isDesignMode') === 'true',
    isPreviewMode: lastParam('isPreviewMode') === 'true',
    isRevisionPreview: searchParams.has('__revisionId'),
    sectionType: lastParam('sectionType') || undefined,
  }
}

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: NO_STORE_HEADERS,
  })
}

function parseDraftItem(payload: unknown): WeaverseNextComponentData | null {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }
  let draftItem = (payload as { draftItem?: unknown }).draftItem
  if (typeof draftItem !== 'object' || draftItem === null) {
    return null
  }
  let { id, type } = draftItem as { id?: unknown; type?: unknown }
  if (typeof id !== 'string' || !id || typeof type !== 'string' || !type) {
    return null
  }
  return draftItem as WeaverseNextComponentData
}

/**
 * Create the Studio per-item revalidation route handler.
 *
 * Studio design-mode edits to loader-backed inputs (e.g. resource pickers) need
 * fresh server loader data for a single item. Re-running it through
 * `router.refresh()` re-applies the whole RSC tree — and the draft-item query
 * rewrite changes the App Router page segment key, remounting the page and
 * resetting scroll. This handler runs just the edited component's `loader`
 * with the unsaved draft settings and returns the payload for an in-place
 * client update (see the `2026-07-02--next-item-revalidation` spec).
 *
 * Security: only registered component types are executable, the handler never
 * persists anything, and responses are `no-store`. Exposure is equivalent to
 * the existing `weaverseDraftItem` URL param, which already lets any visitor
 * run design-mode loaders with arbitrary draft settings.
 *
 * @example
 * ```ts
 * // app/api/weaverse/revalidate/route.ts
 * export const { POST } = createWeaverseNextRevalidateHandler({
 *   getClient: () => getWeaverseServerClient(Promise.resolve({})),
 * })
 * ```
 */
export function createWeaverseNextRevalidateHandler(
  config: WeaverseNextRevalidateHandlerConfig
): { POST: (request: Request) => Promise<Response> } {
  return {
    POST: async (request: Request) => {
      let payload: unknown
      try {
        payload = await request.json()
      } catch {
        return json({ error: 'invalid-payload' }, STATUS_BAD_REQUEST)
      }

      let draftItem = parseDraftItem(payload)
      if (!draftItem) {
        return json({ error: 'invalid-payload' }, STATUS_BAD_REQUEST)
      }

      // Missing `routeContext` is valid legacy input; a present but malformed
      // context is rejected at the trust boundary before any client is created.
      let requestContext: WeaverseNextRequestContext | undefined
      let body = payload as { routeContext?: unknown }
      if (Object.hasOwn(body, 'routeContext')) {
        let reconstructed = reconstructRouteContext(request, body.routeContext)
        if (!reconstructed) {
          return json({ error: 'invalid-route-context' }, STATUS_BAD_REQUEST)
        }
        requestContext = reconstructed
      }

      let client: WeaverseNextServerClient
      try {
        client = await config.getClient(request, requestContext)
      } catch (error) {
        console.error('❌ Revalidate handler getClient failed.', error)
        return json({ error: 'client-init-failed' }, STATUS_SERVER_ERROR)
      }

      let component = client.components.find(
        (candidate) => candidate?.schema?.type === draftItem.type
      )
      if (!component) {
        return json({ error: 'unknown-component-type' }, STATUS_NOT_FOUND)
      }
      if (typeof component.loader !== 'function') {
        return json({ error: 'missing-loader' }, STATUS_UNPROCESSABLE)
      }

      try {
        // Same args shape as `runWeaverseComponentLoaders`, so component
        // loaders behave identically between page load and revalidation.
        let loaderData = await component.loader({
          data: {
            ...generateDataFromSchema(component.schema),
            ...draftItem.data,
          },
          weaverse: client,
          context: client.requestContext,
          commerce: client.commerce,
        })
        return json({ loaderData: loaderData ?? null }, STATUS_OK)
      } catch (error) {
        console.error(
          '❌ Item loader revalidation failed.',
          draftItem.type,
          draftItem.id,
          error
        )
        return json({ error: 'loader-failed' }, STATUS_SERVER_ERROR)
      }
    },
  }
}
