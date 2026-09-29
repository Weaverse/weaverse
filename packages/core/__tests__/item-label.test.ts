import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Weaverse, WeaverseItemStore } from '../src/core'

const TILE_TYPE = 'label-test-tile'
const PLAIN_TYPE = 'label-test-plain'
const UNTITLED_TYPE = 'label-test-untitled'
const ASYNC_TYPE = 'label-test-async'
// Long enough for Node to report an unobserved rejection.
const SETTLE_MS = 20

let tileLabel = vi.fn()

function createRuntime(
  items: { id: string; type: string; heading?: unknown }[]
) {
  return new Weaverse({
    projectId: 'project-1',
    data: { rootId: items[0]?.id ?? '', items },
  })
}

beforeEach(() => {
  Weaverse.ItemConstructor = WeaverseItemStore
  Weaverse.itemInstances.clear()
  Weaverse.elementRegistry.set(TILE_TYPE, {
    type: TILE_TYPE,
    schema: { type: TILE_TYPE, title: 'Tile', label: tileLabel },
  })
  Weaverse.elementRegistry.set(PLAIN_TYPE, {
    type: PLAIN_TYPE,
    schema: { type: PLAIN_TYPE, title: 'Plain' },
  })
  Weaverse.elementRegistry.set(UNTITLED_TYPE, {
    type: UNTITLED_TYPE,
    schema: { type: UNTITLED_TYPE, label: () => '' },
  })
  tileLabel.mockReset()
  tileLabel.mockImplementation((data) => data.heading)
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('WeaverseItemStore.label', () => {
  it('should_return_title_when_schema_has_no_label_callback', () => {
    let weaverse = createRuntime([{ id: 'a', type: PLAIN_TYPE }])

    let label = weaverse.getItemLabel('a')

    expect(label).toBe('Plain')
  })

  it('should_return_trimmed_callback_text_when_callback_returns_text', () => {
    let weaverse = createRuntime([
      { id: 'a', type: TILE_TYPE, heading: '  Summer sale  ' },
    ])

    let label = weaverse.getItemLabel('a')

    expect(label).toBe('Summer sale')
  })

  it.each([
    ['empty', ''],
    ['whitespace', '   '],
    ['number', 42],
    ['object', { text: 'x' }],
    ['null', null],
    ['undefined', undefined],
    ['promise', Promise.resolve('async')],
  ])('should_fall_back_to_title_when_callback_returns_%s', (_, value) => {
    tileLabel.mockImplementation(() => value)
    let weaverse = createRuntime([{ id: 'a', type: TILE_TYPE }])

    let label = weaverse.getItemLabel('a')

    expect(label).toBe('Tile')
  })

  it.each([
    ['rejected_promise', () => Promise.reject(new Error('rejected'))],
    [
      'async_throw',
      async () => {
        throw new Error('async throw')
      },
    ],
    [
      'rejecting_thenable',
      () => ({
        // biome-ignore lint/suspicious/noThenProperty: thenable fixture
        then: (_: unknown, reject: (error: Error) => void) =>
          reject(new Error('thenable')),
      }),
    ],
  ])('should_not_leak_unhandled_rejection_when_callback_returns_%s', async (_, callback) => {
    // A plain callback: `vi.fn()` observes returned promises itself, which
    // would hide the leak this test guards against.
    let unhandled = vi.fn()
    process.on('unhandledRejection', unhandled)
    Weaverse.elementRegistry.set(ASYNC_TYPE, {
      type: ASYNC_TYPE,
      schema: { type: ASYNC_TYPE, title: 'Tile', label: callback },
    })
    let weaverse = createRuntime([{ id: 'a', type: ASYNC_TYPE }])

    let label = weaverse.getItemLabel('a')
    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS))
    process.off('unhandledRejection', unhandled)

    expect({ label, unhandled: unhandled.mock.calls.length }).toEqual({
      label: 'Tile',
      unhandled: 0,
    })
  })

  it('should_keep_title_when_async_callback_resolves_later', async () => {
    tileLabel.mockImplementation(async () => 'Late label')
    let weaverse = createRuntime([{ id: 'a', type: TILE_TYPE }])

    weaverse.getItemLabel('a')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(weaverse.getItemLabel('a')).toBe('Tile')
  })

  it('should_fall_back_to_title_when_callback_throws', () => {
    tileLabel.mockImplementation(() => {
      throw new Error('boom')
    })
    let weaverse = createRuntime([{ id: 'a', type: TILE_TYPE }])

    let label = weaverse.getItemLabel('a')

    expect(label).toBe('Tile')
  })

  it('should_fall_back_to_type_when_schema_title_is_missing', () => {
    let weaverse = createRuntime([{ id: 'a', type: UNTITLED_TYPE }])

    let label = weaverse.getItemLabel('a')

    expect(label).toBe(UNTITLED_TYPE)
  })

  it('should_resolve_independent_labels_when_items_share_a_type', () => {
    let weaverse = createRuntime([
      { id: 'a', type: TILE_TYPE, heading: 'First' },
      { id: 'b', type: TILE_TYPE, heading: 'Second' },
    ])

    let labels = [weaverse.getItemLabel('a'), weaverse.getItemLabel('b')]

    expect(labels).toEqual(['First', 'Second'])
  })

  it('should_reflect_current_data_when_item_data_changes', () => {
    let weaverse = createRuntime([{ id: 'a', type: TILE_TYPE, heading: 'Old' }])

    weaverse.itemInstances.get('a').setData({ heading: 'New' })

    expect(weaverse.getItemLabel('a')).toBe('New')
  })

  it('should_not_invoke_callback_when_label_is_not_read', () => {
    createRuntime([{ id: 'a', type: TILE_TYPE, heading: 'Unread' }])

    let callCount = tileLabel.mock.calls.length

    expect(callCount).toBe(0)
  })

  it('should_return_undefined_when_item_id_is_unknown', () => {
    let weaverse = createRuntime([{ id: 'a', type: PLAIN_TYPE }])

    let label = weaverse.getItemLabel('missing')

    expect(label).toBeUndefined()
  })
})
