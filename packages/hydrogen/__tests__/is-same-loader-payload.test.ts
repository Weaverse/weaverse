import { describe, expect, it } from 'vitest'
import { isSameLoaderPayload } from '../src/utils/is-same-loader-payload'

/** Self-referencing route data: `root.shop.parent === root`. */
function makeSelfCycle(shopName: string) {
  let shop: Record<string, unknown> = { name: shopName }
  let root: Record<string, unknown> = { shop }
  shop.parent = root
  return root
}

describe('isSameLoaderPayload', () => {
  it('should_report_equal_when_plain_payloads_match_with_different_key_order', () => {
    let left = { id: 'page-1', items: [{ id: 'item-1', index: 0 }] }
    let right = { items: [{ index: 0, id: 'item-1' }], id: 'page-1' }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(true)
  })

  it('should_report_changed_when_a_nested_leaf_differs', () => {
    let left = { page: { items: [{ id: 'item-1' }] } }
    let right = { page: { items: [{ id: 'item-2' }] } }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(false)
  })

  it('should_report_changed_when_array_lengths_differ', () => {
    let left = { items: [1, 2] }
    let right = { items: [1, 2, 3] }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(false)
  })

  it('should_report_equal_when_arrays_hold_json_omitted_holes_in_the_same_slots', () => {
    // JSON.stringify serializes both as `[null]`.
    let result = isSameLoaderPayload([undefined], [() => undefined])

    expect(result).toBe(true)
  })

  it('should_report_equal_when_only_json_omitted_properties_differ', () => {
    let left = { name: 'Weaverse', onSelect: () => undefined }
    let right = { name: 'Weaverse', missing: undefined }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(true)
  })

  it('should_report_changed_when_the_right_side_adds_a_json_visible_key', () => {
    let left = { name: 'Weaverse' }
    let right = { name: 'Weaverse', locale: 'en' }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(false)
  })

  it('should_report_equal_when_a_non_finite_number_faces_the_null_it_serializes_to', () => {
    // A revalidated wire payload carries `null` where the in-memory value was
    // NaN/Infinity; treating that as a change would re-render every render.
    let result = isSameLoaderPayload({ ratio: Number.NaN }, { ratio: null })

    expect(result).toBe(true)
  })

  it('should_report_equal_when_dates_carry_the_same_instant', () => {
    let left = { publishedAt: new Date('2026-07-28T00:00:00.000Z') }
    let right = { publishedAt: new Date('2026-07-28T00:00:00.000Z') }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(true)
  })

  it('should_report_changed_when_a_date_moves_to_another_instant', () => {
    let left = { publishedAt: new Date('2026-07-28T00:00:00.000Z') }
    let right = { publishedAt: new Date('2026-07-29T00:00:00.000Z') }

    let result = isSameLoaderPayload(left, right)

    expect(result).toBe(false)
  })

  it('should_report_equal_when_the_same_promise_identity_is_reused', () => {
    let deferred = Promise.resolve({ colors: [] })

    let result = isSameLoaderPayload(
      { root: { swatchesConfigs: deferred } },
      { root: { swatchesConfigs: deferred } }
    )

    expect(result).toBe(true)
  })

  it('should_report_changed_when_a_distinct_promise_resolves_to_equal_data', () => {
    // Both stringify as `{}` — identity is the only signal that the loader
    // handed us a fresh deferred value.
    let result = isSameLoaderPayload(
      { root: { swatchesConfigs: Promise.resolve({ colors: [] }) } },
      { root: { swatchesConfigs: Promise.resolve({ colors: [] }) } }
    )

    expect(result).toBe(false)
  })

  it('should_report_changed_when_distinct_thenables_stand_in_for_promises', () => {
    // Cross-realm promises and hand-rolled thenables fail `instanceof Promise`;
    // duck-typing keeps them atomic instead of collapsing them to `{}`.
    // biome-ignore-start lint/suspicious/noThenProperty: exercising the thenable detection path requires a literal `then`
    let result = isSameLoaderPayload(
      { deferred: { then: () => undefined } },
      { deferred: { then: () => undefined } }
    )
    // biome-ignore-end lint/suspicious/noThenProperty: see above

    expect(result).toBe(false)
  })

  it('should_report_changed_when_distinct_opaque_objects_hold_equal_entries', () => {
    let result = isSameLoaderPayload(
      { index: new Map([['a', 1]]) },
      { index: new Map([['a', 1]]) }
    )

    expect(result).toBe(false)
  })

  it('should_not_descend_into_react_debug_metadata_on_a_reused_promise', () => {
    let deferred = Promise.resolve({ colors: [] })
    let debugEntry: Record<string, unknown> = { awaited: {} }
    ;(debugEntry.awaited as Record<string, unknown>).value = deferred
    ;(deferred as unknown as Record<string, unknown>)._debugInfo = [debugEntry]

    let result = isSameLoaderPayload({ root: deferred }, { root: deferred })

    expect(result).toBe(true)
  })

  it('should_report_equal_when_self_cycles_have_equal_leaves', () => {
    let result = isSameLoaderPayload(
      makeSelfCycle('Weaverse'),
      makeSelfCycle('Weaverse')
    )

    expect(result).toBe(true)
  })

  it('should_report_changed_when_self_cycles_differ_at_a_leaf', () => {
    let result = isSameLoaderPayload(
      makeSelfCycle('Weaverse'),
      makeSelfCycle('Pilot')
    )

    expect(result).toBe(false)
  })

  it('should_report_equal_when_a_self_cycle_is_bisimilar_to_a_mutual_cycle', () => {
    let single: Record<string, unknown> = {}
    single.next = single
    let first: Record<string, unknown> = {}
    let second: Record<string, unknown> = { next: first }
    first.next = second

    let result = isSameLoaderPayload(single, first)

    expect(result).toBe(true)
  })

  it('should_report_changed_when_a_cycle_faces_a_finite_chain', () => {
    let cyclic: Record<string, unknown> = {}
    cyclic.next = cyclic
    let finite = { next: { next: null } }

    let result = isSameLoaderPayload(cyclic, finite)

    expect(result).toBe(false)
  })

  it('should_report_equal_when_repeated_aliases_face_distinct_equal_objects', () => {
    // Aliasing is not observable through JSON, so it is not a change signal.
    let shared = { name: 'Weaverse' }

    let result = isSameLoaderPayload(
      { a: shared, b: shared },
      { a: { name: 'Weaverse' }, b: { name: 'Weaverse' } }
    )

    expect(result).toBe(true)
  })

  it('should_report_changed_when_an_array_faces_a_plain_object', () => {
    let result = isSameLoaderPayload({ items: [] }, { items: {} })

    expect(result).toBe(false)
  })

  it('should_report_equal_when_both_sides_are_null', () => {
    let result = isSameLoaderPayload(null, null)

    expect(result).toBe(true)
  })

  it('should_report_changed_when_null_faces_an_empty_object', () => {
    let result = isSameLoaderPayload(null, {})

    expect(result).toBe(false)
  })
})
