import type {
  WeaverseNextComponentData,
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

export interface WeaverseNextRevalidateHandlerConfig {
  /**
   * Reuse the app's server-client factory so the loader runs with the same
   * component registry and commerce (storefront) context as page loads.
   */
  getClient: (
    request: Request
  ) => Promise<WeaverseNextServerClient> | WeaverseNextServerClient
}

/** POST body accepted by the revalidate route. */
export interface WeaverseNextRevalidateRequestBody {
  draftItem: WeaverseNextComponentData
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

      let client: WeaverseNextServerClient
      try {
        client = await config.getClient(request)
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
