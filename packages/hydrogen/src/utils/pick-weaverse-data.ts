import type { UIMatch } from 'react-router'
import type { WeaverseLoaderData } from '../types'

/**
 * Weaverse page data accepted by {@link WeaverseHydrogenRoot}, including
 * deferred React Router loader results and an explicit no-render value.
 */
export type WeaverseDataValue =
  | WeaverseLoaderData
  | Promise<WeaverseLoaderData>
  | null

/**
 * Resolve the `weaverseData` payload for a `<WeaverseHydrogenRoot>` instance.
 *
 * Resolution order (first match wins):
 *
 *  1. **Explicit prop** — the caller passed `data` directly. Used as-is,
 *     including when it is a `Promise` (handled upstream via `<Await>`) or
 *     an explicit `null` (suppresses rendering).
 *  2. **Own route's loader data** — the loader data for the route that
 *     rendered this component, obtained via `useLoaderData()`. This is
 *     React Router's route-scoped primitive and is what makes nested
 *     layout + child Weaverse pages work: each `<WeaverseContent />`
 *     resolves to *its own* route's `weaverseData` regardless of siblings.
 *  3. **Ancestor match fallback** — walk `useMatches()` from leaf to root
 *     and return the first ancestor whose `loaderData` exposes a
 *     `weaverseData` key. This preserves the long-standing behaviour where
 *     a child route with no loader (e.g. an `index.tsx` that omits
 *     `weaverseData`) still renders its layout's Weaverse page.
 *
 * The helper is intentionally pure (no hook calls) so it can be unit-tested
 * without a React Router context. Hook calls happen in the component.
 *
 * ## Back-compat contract
 *
 * Themes that pre-date the `data` prop addition pass `dataProp === undefined`,
 * so resolution starts at Tier 2. For the canonical single-instance pattern
 * (one `<WeaverseContent />` inside a route whose loader returns
 * `{ weaverseData }`), Tier 2 returns the same value the old `useMatches()`
 * walk did. For the index-without-loader pattern (leaf route exposes no
 * `weaverseData`, layout does), Tier 3's leaf→root walk produces an
 * identical result to the pre-fix code. The only intentional behaviour
 * change is the issue #451 case: two `<WeaverseContent />` instances on the
 * same URL (layout + child, both with their own `weaverseData`) now each
 * render their own page instead of both rendering the deepest one.
 */
export function pickWeaverseData(
  dataProp: WeaverseDataValue | undefined,
  ownLoaderData: unknown,
  matches: ReadonlyArray<Pick<UIMatch, 'loaderData'>>
): WeaverseDataValue {
  // Tier 1: explicit prop wins (including explicit `null`).
  if (dataProp !== undefined) {
    return dataProp
  }

  // Tier 2: own route's loader data — the route-scoped primitive.
  if (hasWeaverseData(ownLoaderData)) {
    return ownLoaderData.weaverseData as WeaverseDataValue
  }

  // Tier 3: ancestor walk (leaf → root) for legacy / index-without-loader cases.
  for (let i = matches.length - 1; i >= 0; i--) {
    const loaderData = matches[i].loaderData
    if (hasWeaverseData(loaderData)) {
      return loaderData.weaverseData as WeaverseDataValue
    }
  }

  return null
}

function hasWeaverseData(
  value: unknown
): value is Record<string, unknown> & { weaverseData: unknown } {
  // The `in` check alone returns true for `{ weaverseData: undefined }`,
  // which would let Tier 2 short-circuit and return `undefined` — bypassing
  // the Tier 3 ancestor walk that would otherwise resolve the missing data.
  // Require the value to be present (not `undefined`).
  if (
    typeof value !== 'object' ||
    value === null ||
    !('weaverseData' in (value as Record<string, unknown>))
  ) {
    return false
  }
  return (value as Record<string, unknown>).weaverseData !== undefined
}
