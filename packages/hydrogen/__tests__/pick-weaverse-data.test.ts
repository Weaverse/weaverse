import { describe, expect, it } from 'vitest'
import {
  matchesHaveWeaverseData,
  pickWeaverseData,
} from '../src/utils/pick-weaverse-data'

// Minimal shape compatible with UIMatch['loaderData']; the helper only reads it.
type Match = { loaderData: unknown }

const layoutData = { page: { id: 'help-layout' } } as any
const childData = { page: { id: 'help-contact' } } as any
const otherData = { page: { id: 'other' } } as any

describe('pickWeaverseData', () => {
  describe('Tier 1: explicit data prop', () => {
    it('returns explicit prop when provided', () => {
      const matches: Match[] = [{ loaderData: { weaverseData: otherData } }]
      const ownLoaderData = { weaverseData: otherData }

      expect(pickWeaverseData(layoutData, ownLoaderData, matches)).toBe(
        layoutData
      )
    })

    it('returns explicit null prop (suppresses rendering)', () => {
      const matches: Match[] = [{ loaderData: { weaverseData: otherData } }]
      const ownLoaderData = { weaverseData: otherData }

      expect(pickWeaverseData(null, ownLoaderData, matches)).toBeNull()
    })

    it('returns explicit Promise prop and does not unwrap', () => {
      const pending = Promise.resolve(layoutData)
      const matches: Match[] = [{ loaderData: { weaverseData: otherData } }]

      const result = pickWeaverseData(pending, undefined, matches)

      expect(result).toBe(pending)
    })

    it('falls through to next tier when prop is undefined', () => {
      const matches: Match[] = []
      const ownLoaderData = { weaverseData: layoutData }

      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        layoutData
      )
    })
  })

  describe('Tier 2: own route loader data (route-scoped primitive)', () => {
    it('returns own route weaverseData when present', () => {
      const matches: Match[] = [
        { loaderData: { weaverseData: layoutData } },
        { loaderData: { weaverseData: childData } },
      ]
      const ownLoaderData = { weaverseData: layoutData }

      // This is the issue #451 case: a layout instance must NOT receive the
      // child's data even though the child appears deeper in matches.
      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        layoutData
      )
    })

    it('returns Promise weaverseData unchanged when own loader defers it', () => {
      const pending = Promise.resolve(childData)
      const ownLoaderData = { weaverseData: pending }

      expect(pickWeaverseData(undefined, ownLoaderData, [])).toBe(pending)
    })

    it('ignores own loader data when it has no weaverseData key', () => {
      const matches: Match[] = [{ loaderData: { weaverseData: layoutData } }]
      const ownLoaderData = { shop: { name: 'Acme' } }

      // Falls through to Tier 3 ancestor walk.
      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        layoutData
      )
    })

    it('falls through to Tier 3 when own loader data has weaverseData: undefined', () => {
      // Regression: `in` operator returns true for `{ weaverseData: undefined }`,
      // which would let Tier 2 short-circuit and return undefined, bypassing
      // the ancestor walk. The helper must treat `undefined` as absent.
      const matches: Match[] = [{ loaderData: { weaverseData: layoutData } }]
      const ownLoaderData = { weaverseData: undefined }

      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        layoutData
      )
    })

    it('returns null when own loader has weaverseData: undefined and no ancestor has data', () => {
      const matches: Match[] = [{ loaderData: { weaverseData: undefined } }]
      const ownLoaderData = { weaverseData: undefined }

      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBeNull()
    })

    it('ignores non-object own loader data', () => {
      const matches: Match[] = [{ loaderData: { weaverseData: layoutData } }]

      expect(pickWeaverseData(undefined, null, matches)).toBe(layoutData)
      expect(pickWeaverseData(undefined, undefined, matches)).toBe(layoutData)
      expect(pickWeaverseData(undefined, 'string', matches)).toBe(layoutData)
      expect(pickWeaverseData(undefined, 42, matches)).toBe(layoutData)
    })
  })

  describe('Tier 3: ancestor matches walk (legacy fallback)', () => {
    it('returns deepest ancestor with weaverseData when own has none', () => {
      const matches: Match[] = [
        { loaderData: { weaverseData: layoutData } },
        { loaderData: { weaverseData: childData } },
      ]

      // Own loader data has no weaverseData → walk matches leaf → root.
      // Deepest (childData) wins, preserving v5.x.x behaviour for the
      // index-route-without-loader case the issue calls out.
      expect(pickWeaverseData(undefined, {}, matches)).toBe(childData)
    })

    it('skips matches whose loaderData lacks weaverseData', () => {
      const matches: Match[] = [
        { loaderData: { weaverseData: layoutData } },
        { loaderData: { shop: { name: 'Acme' } } }, // no weaverseData
        { loaderData: null },
      ]

      expect(pickWeaverseData(undefined, undefined, matches)).toBe(layoutData)
    })

    it('skips matches with weaverseData: undefined', () => {
      // Same regression as Tier 2: `in` check alone would falsely match.
      const matches: Match[] = [
        { loaderData: { weaverseData: layoutData } },
        { loaderData: { weaverseData: undefined } }, // present-but-undefined
      ]

      expect(pickWeaverseData(undefined, undefined, matches)).toBe(layoutData)
    })

    it('returns null when no match has weaverseData', () => {
      const matches: Match[] = [
        { loaderData: { shop: { name: 'Acme' } } },
        { loaderData: undefined },
        { loaderData: null },
      ]

      expect(pickWeaverseData(undefined, undefined, matches)).toBeNull()
    })

    it('returns null for empty matches with no own data', () => {
      expect(pickWeaverseData(undefined, undefined, [])).toBeNull()
    })
  })

  describe('back-compat: unmodified pilot themes (zero-prop WeaverseContent)', () => {
    it('canonical pilot route: loader returns { weaverseData }, default renders <WeaverseContent />', () => {
      // Simulates an older pilot route module exactly as it ships today:
      //   export async function loader() { return { weaverseData } }
      //   export default () => <WeaverseContent />   // no `data` prop
      // WeaverseHydrogenRoot then calls pickWeaverseData(undefined, ownLoaderData, matches).
      const ownLoaderData = { weaverseData: childData }
      // useMatches() returns [root, currentRoute] in framework mode; both may
      // expose weaverseData (root usually doesn't). The single route case:
      const matches: Match[] = [{ loaderData: ownLoaderData }]

      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        childData
      )
    })

    it('canonical pilot route with extra root match: still resolves to own route', () => {
      // Real Hydrogen apps always have a root route in the matches array,
      // typically returning shop/cart/etc. but NOT weaverseData.
      const ownLoaderData = { weaverseData: childData }
      const matches: Match[] = [
        { loaderData: { shop: { name: 'Pilot' }, cart: null } }, // root
        { loaderData: ownLoaderData }, // current route
      ]

      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        childData
      )
    })

    it('legacy index-without-loader: list.tsx renders inside layout, layout provides weaverseData', () => {
      // Pre-fix behaviour the issue explicitly preserves: an index/leaf route
      // that has no loader (or a loader that omits weaverseData) falls back
      // to its layout's data via the ancestor walk. This pattern is in active
      // use (e.g. policies/list.tsx, collections/list.tsx in pilot variants).
      const matches: Match[] = [
        { loaderData: { shop: { name: 'Pilot' } } }, // root
        { loaderData: { weaverseData: layoutData } }, // layout
        { loaderData: {} }, // leaf index, no weaverseData
      ]
      const ownLoaderData = {} // leaf is the rendering route

      expect(pickWeaverseData(undefined, ownLoaderData, matches)).toBe(
        layoutData
      )
    })

    it('legacy deferred loader: Promise weaverseData still flows through unchanged', () => {
      const pending = Promise.resolve(childData)
      const ownLoaderData = { weaverseData: pending }

      expect(
        pickWeaverseData(undefined, ownLoaderData, [
          { loaderData: ownLoaderData },
        ])
      ).toBe(pending)
    })

    it('legacy missing weaverseData: returns null so errorComponent renders', () => {
      // Mirrors the existing "No Weaverse data found in route matches!"
      // error path from WeaverseHydrogenRoot.
      const matches: Match[] = [
        { loaderData: { shop: { name: 'Pilot' } } },
        { loaderData: { someOtherKey: 1 } },
      ]

      expect(pickWeaverseData(undefined, {}, matches)).toBeNull()
    })
  })

  describe('issue #451 regression: layout + child compose correctly', () => {
    it('layout instance resolves to layout page; child instance resolves to child page', () => {
      // Same matches array (useMatches is tree-global); each instance has its
      // own loaderData via useLoaderData(). The two instances must diverge.
      const matches: Match[] = [
        { loaderData: { weaverseData: layoutData } },
        { loaderData: { weaverseData: childData } },
      ]

      const layoutInstance = pickWeaverseData(
        undefined,
        { weaverseData: layoutData },
        matches
      )
      const childInstance = pickWeaverseData(
        undefined,
        { weaverseData: childData },
        matches
      )

      expect(layoutInstance).toBe(layoutData)
      expect(childInstance).toBe(childData)
      expect(layoutInstance).not.toBe(childInstance)
    })
  })

  describe('matchesHaveWeaverseData (root connect fallback gate)', () => {
    it('is false when no match carries weaverseData', () => {
      // 404 / error / non-Weaverse route: the root bridge should load.
      expect(matchesHaveWeaverseData([])).toBe(false)
      expect(
        matchesHaveWeaverseData([
          { loaderData: { shop: { name: 'Acme' } } },
          { loaderData: undefined },
        ])
      ).toBe(false)
      // Neither `undefined` nor an explicit `null` counts: `WeaverseHydrogenRoot`
      // only mounts when weaverseData is truthy, so a null page (loadPage found
      // nothing / caught an error) must still get the root fallback bridge.
      expect(
        matchesHaveWeaverseData([{ loaderData: { weaverseData: undefined } }])
      ).toBe(false)
      expect(
        matchesHaveWeaverseData([{ loaderData: { weaverseData: null } }])
      ).toBe(false)
    })

    it('is true for resolved data so the page-scoped bridge owns it', () => {
      expect(
        matchesHaveWeaverseData([{ loaderData: { weaverseData: childData } }])
      ).toBe(true)
    })

    it('is true for a still-pending deferred weaverseData Promise', () => {
      // The regression guard: a deferred content route must keep the root
      // bridge out so it can't answer checkWeaversePage() before content renders.
      let pending = Promise.resolve(childData)
      expect(
        matchesHaveWeaverseData([
          { loaderData: { shop: { name: 'Acme' } } },
          { loaderData: { weaverseData: pending } },
        ])
      ).toBe(true)
    })

    it('reads the older match.data alias when loaderData is absent', () => {
      // react-router ^7 spans versions before UIMatch.loaderData existed, where
      // useMatches() only populates `data`.
      expect(
        matchesHaveWeaverseData([{ data: { weaverseData: childData } }])
      ).toBe(true)
      expect(matchesHaveWeaverseData([{ data: { weaverseData: null } }])).toBe(
        false
      )
    })
  })
})
