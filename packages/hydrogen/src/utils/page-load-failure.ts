import {
  hasError,
  WeaverseError,
  WeaverseLoadError,
  type WeaverseLoadFailureKind,
} from '../types'

/**
 * Gives a rejection from Hydrogen's cached fetch the code `fetchOnce` gives
 * the same failure on the direct path.
 *
 * Hydrogen calls the platform `fetch` itself, so a request that never got a
 * response rejects with the platform's error instead of a `WeaverseError`.
 * The Fetch standard rejects a network failure with a `TypeError` and an
 * aborted request with the signal's `AbortError`/`TimeoutError`; those are
 * outages. Anything else is returned unchanged, so it is not reported as one.
 */
export function cachedTransportError(error: unknown, url: string): unknown {
  if (error instanceof WeaverseError || !(error instanceof Error)) {
    return error
  }
  if (error.name === 'AbortError' || error.name === 'TimeoutError') {
    return new WeaverseError('Request timed out', 'TIMEOUT_ERROR', undefined, {
      url,
    })
  }
  if (error instanceof TypeError) {
    return new WeaverseError(
      'Network error during fetch',
      'NETWORK_ERROR',
      undefined,
      { url, cause: error.message }
    )
  }
  return error
}

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Whether a successful `/project` body is a page envelope.
 *
 * `page: null` is Builder's authoritative "nothing assigned at this URL" and
 * stays valid; anything without a `page` field, with an `error` field, or with
 * a page that has no item list is not an answer about this URL at all.
 */
export function isProjectEnvelope(payload: unknown): boolean {
  if (!isPlainObject(payload) || hasError(payload) || !('page' in payload)) {
    return false
  }
  const { page, project } = payload
  const validPage =
    page === null || (isPlainObject(page) && Array.isArray(page.items))
  return validPage && (project == null || isPlainObject(project))
}

/**
 * Classifies a page-load failure. `'absent'` is Builder's 404 for a project
 * that does not exist, which keeps resolving to `null` like before.
 */
export function classifyPageLoadFailure(
  error: unknown
): WeaverseLoadFailureKind | 'absent' {
  if (error instanceof WeaverseLoadError) {
    return error.kind
  }
  if (!(error instanceof WeaverseError)) {
    // Thrown while turning a response into page data: the body was not
    // the shape it claimed to be.
    return 'invalid-response'
  }
  if (error.code === 'TIMEOUT_ERROR' || error.code === 'NETWORK_ERROR') {
    return 'unavailable'
  }
  if (error.code === 'INVALID_RESPONSE') {
    return 'invalid-response'
  }
  if (error.code === 'FETCH_ERROR') {
    const status = error.statusCode ?? 0
    if (status === 404) {
      return 'absent'
    }
    if (status === 408 || status === 425 || status === 429 || status >= 500) {
      return 'unavailable'
    }
  }
  // Refusals (400/401/403) and project-ID errors: retrying cannot succeed.
  return 'configuration'
}

/**
 * Turns a caught page-load error into the opt-in rejection, or `null` when
 * the failure must keep resolving to `null` (absence, or the opt-in is off).
 */
export function toPageLoadRejection(
  error: unknown,
  throwPageLoadFailures: boolean
): WeaverseLoadError | null {
  const failure = classifyPageLoadFailure(error)
  if (failure === 'absent' || !throwPageLoadFailures) {
    return null
  }
  if (error instanceof WeaverseLoadError) {
    return error
  }
  // Fixed message: the cause can carry request-derived detail.
  return new WeaverseLoadError(
    'Unable to load Weaverse page',
    failure,
    error instanceof WeaverseError ? error.statusCode : undefined
  )
}
