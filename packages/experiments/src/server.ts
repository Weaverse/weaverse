/**
 * `@weaverse/experiments/server` — request adapter built on web standards
 * (`Request`, `Headers`, `crypto.randomUUID`). No framework dependency, so it
 * runs anywhere a Fetch-API request is available: Shopify Oxygen/Hydrogen,
 * Cloudflare Workers, Next.js edge/route handlers, Remix, Deno, Bun.
 *
 * It resolves a stable visitor seed (minting a first-party cookie once if
 * needed), assigns every configured experiment deterministically, and maps the
 * chosen variant to a Weaverse `projectId` for project-level A/B testing.
 *
 * @packageDocumentation
 */

import type { Assignment, Experiment } from './index.js'
import { resolveExperiments } from './index.js'

export type { Assignment, Experiment, ExperimentVariant } from './index.js'

const DEFAULT_SEED_COOKIE = '_wv_vid'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/** Configures experiment resolution for an incoming request. */
export interface ExperimentsServerConfig {
  /** Cookie name used to persist the minted visitor seed. Default `_wv_vid`. */
  cookieName?: string
  /** Experiments to resolve for this request. */
  experiments: Experiment[]
  /** Lifetime of the seed cookie in seconds. Default one year. */
  maxAge?: number
  /**
   * Id of the experiment whose chosen variant supplies `projectId`. Defaults
   * to the first experiment. Use it when several experiments run at once but
   * only one drives project selection.
   */
  projectIdFrom?: string
  /**
   * Pre-resolved seed (e.g. a logged-in customer id or an existing Shopify
   * visitor token). When provided, no cookie is read or minted.
   */
  seed?: string
}

/** Contains assignments and response metadata resolved for a request. */
export interface ExperimentsResult {
  /** One assignment per configured experiment, in input order. */
  assignments: Assignment[]
  /**
   * Convenience `Headers` carrying `Set-Cookie` when one is needed (otherwise
   * empty). Merge into the `Response` you return from the loader/handler.
   */
  headers: Headers
  /**
   * `projectId` from the designated experiment's chosen variant, or `undefined`
   * when that variant declares none. Feed it to `new WeaverseClient(...)` or
   * `weaverse.loadPage({ projectId })`. During a Weaverse Studio preview
   * (`?weaverseProjectId=…`) this is the pinned project instead, so each variant
   * stays previewable by opening its own project in Studio.
   */
  projectId?: string
  /** The stable visitor seed used to compute the assignments. */
  seed: string
  /**
   * `Set-Cookie` value persisting a freshly-minted seed, or `undefined` when
   * the seed already existed or was supplied via `config.seed`. Append it to
   * your response headers to make assignment sticky across visits.
   */
  setCookie?: string
}

function readCookie(
  cookieHeader: string | null,
  name: string
): string | undefined {
  if (!cookieHeader) {
    return
  }
  for (let pair of cookieHeader.split(';')) {
    let index = pair.indexOf('=')
    if (index === -1) {
      continue
    }
    if (pair.slice(0, index).trim() === name) {
      try {
        return decodeURIComponent(pair.slice(index + 1).trim())
      } catch {
        // Malformed percent-encoding in a client-controlled cookie: treat it as
        // absent so a fresh seed is minted instead of throwing on every request.
        return
      }
    }
  }
  return
}

/**
 * Resolves experiment assignments for an incoming request.
 *
 * Seed precedence: `config.seed` → existing `cookieName` cookie → a newly
 * minted UUID (returned as `setCookie`/`headers` for persistence).
 */
export function getExperiments(
  request: Request,
  config: ExperimentsServerConfig
): ExperimentsResult {
  let { experiments, projectIdFrom, cookieName, maxAge } = config
  let name = cookieName ?? DEFAULT_SEED_COOKIE
  let headers = new Headers()

  // Weaverse Studio drives the storefront preview with the project being edited
  // pinned via the `weaverseProjectId` query param — priority-1 in the SDK's
  // projectId resolver, which keeps the LAST value of the key. Each variant is
  // its own project, so previewing a variant means opening that project in
  // Studio. Defer to it here: otherwise the hashed assignment below would supply
  // a `projectId` that overrides `loadPage({ projectId })` and hijack the
  // preview, pinning the editor to whichever variant the cookie buckets into.
  let previewProjectId = new URL(request.url).searchParams
    .getAll('weaverseProjectId')
    .at(-1)

  let seed = config.seed
  let setCookie: string | undefined
  if (!seed) {
    let existing = readCookie(request.headers.get('cookie'), name)
    if (existing) {
      seed = existing
    } else if (previewProjectId) {
      // Resolve deterministically for the preview without persisting a cookie.
      seed = previewProjectId
    } else {
      seed = crypto.randomUUID()
      setCookie = `${name}=${seed}; Path=/; Max-Age=${maxAge ?? ONE_YEAR_SECONDS}; SameSite=Lax; HttpOnly; Secure`
      headers.set('Set-Cookie', setCookie)
    }
  }

  let assignments = resolveExperiments(experiments, seed)

  if (previewProjectId) {
    // Force the assignment whose variant maps to the previewed project so
    // `useExperiment(...)` and analytics `customData` match what Studio renders.
    assignments = assignments.map((assignment) => {
      let previewed = experiments
        .find((experiment) => experiment.id === assignment.experimentId)
        ?.variants.find((variant) => variant.projectId === previewProjectId)
      return previewed
        ? { experimentId: assignment.experimentId, variant: previewed }
        : assignment
    })
    return {
      assignments,
      seed,
      projectId: previewProjectId,
      setCookie,
      headers,
    }
  }

  let projectExperimentId = projectIdFrom ?? experiments[0]?.id
  let projectId = assignments.find(
    (assignment) => assignment.experimentId === projectExperimentId
  )?.variant.projectId

  return { assignments, seed, projectId, setCookie, headers }
}
