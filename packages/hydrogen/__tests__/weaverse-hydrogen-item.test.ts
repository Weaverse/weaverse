import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  HydrogenComponentSchema,
  HydrogenPageData,
  WeaverseHydrogenParams,
} from '../src/types'
import {
  registerComponent,
  WeaverseHydrogen,
} from '../src/WeaverseHydrogenRoot'

const ITEM_ID = 'item-1'
const ROOT_ID = 'root-1'

const SCHEMA = {
  type: 'test-add-to-cart',
  title: 'Test Add To Cart',
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'buttonText', defaultValue: 'Add to cart' },
        { type: 'text', name: 'heading', defaultValue: 'Featured product' },
      ],
    },
  ],
} as unknown as HydrogenComponentSchema

// The page root item needs a registered schema too, otherwise its store logs
// "Element is missing schema or not found!" and clutters the test output.
const ROOT_SCHEMA = {
  type: 'main',
  title: 'Main',
  settings: [],
} as unknown as HydrogenComponentSchema

function makePageData(itemData?: Record<string, unknown>): HydrogenPageData {
  return {
    id: 'page-1',
    name: 'Page',
    rootId: ROOT_ID,
    items: [
      { id: ROOT_ID, type: 'main', data: {}, childIds: [ITEM_ID] },
      {
        id: ITEM_ID,
        type: SCHEMA.type,
        ...(itemData === undefined ? {} : { data: itemData }),
        parentId: ROOT_ID,
      },
    ],
  } as unknown as HydrogenPageData
}

function makePageDataWithoutItemData(): HydrogenPageData {
  return makePageData()
}

function makeInstance(itemData: Record<string, unknown>): WeaverseHydrogen {
  return new WeaverseHydrogen({
    data: makePageData(itemData),
    internal: {},
    pageId: 'page-1',
    projectId: 'project-1',
    requestInfo: { pathname: '/', search: '', queries: {} },
    weaverseApiBase: 'https://api.weaverse.io',
    weaverseApiKey: 'key',
    weaverseHost: 'https://studio.weaverse.io',
    weaverseVersion: '',
  } as unknown as WeaverseHydrogenParams)
}

describe('WeaverseHydrogenItem.setData', () => {
  beforeEach(() => {
    // Item stores live in a static Map shared across instances — the reuse
    // path under test depends on it, so reset it between tests.
    WeaverseHydrogen.itemInstances.clear()
    for (const schema of [SCHEMA, ROOT_SCHEMA]) {
      registerComponent({
        type: schema.type,
        Component: (() => null) as never,
        schema,
      })
    }
  })

  it('should_flatten_fresh_settings_when_reused_item_receives_new_locale_data', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })

    weaverse.setProjectData(makePageData({ buttonText: 'Add to bag' }))

    expect(weaverse.itemInstances.get(ITEM_ID)?.data.buttonText).toBe(
      'Add to bag'
    )
  })

  it('should_reset_omitted_field_to_schema_default_when_reused_item_omits_it', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })

    // EN payload omits `buttonText` because it equals the schema default.
    weaverse.setProjectData(makePageData({}))

    expect(weaverse.itemInstances.get(ITEM_ID)?.data.buttonText).toBe(
      'Add to cart'
    )
  })

  it('should_reset_schema_defaults_when_serialized_item_omits_data_property', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })

    weaverse.setProjectData(makePageDataWithoutItemData())

    expect(weaverse.itemInstances.get(ITEM_ID)?.data.buttonText).toBe(
      'Add to cart'
    )
  })

  it('should_replace_nested_serialized_data_when_reused_item_receives_fresh_data', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })

    weaverse.setProjectData(makePageData({ buttonText: 'Add to bag' }))

    expect(weaverse.itemInstances.get(ITEM_ID)?.data.data).toEqual({
      buttonText: 'Add to bag',
    })
  })

  it('should_preserve_settings_when_setData_receives_empty_update', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })
    let item = weaverse.itemInstances.get(ITEM_ID)

    item?.setData({})

    expect(item?.data.buttonText).toBe('In den Warenkorb')
  })

  it('should_swap_store_reference_when_setData_receives_empty_update', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })
    let item = weaverse.itemInstances.get(ITEM_ID)
    let before = item?.data

    item?.setData({})

    expect(item?.data).not.toBe(before)
  })

  it('should_notify_subscribers_when_setData_receives_empty_update', () => {
    let weaverse = makeInstance({ buttonText: 'In den Warenkorb' })
    let item = weaverse.itemInstances.get(ITEM_ID)
    let listener = vi.fn()
    item?.subscribe(listener)

    item?.setData({})

    expect(listener).toHaveBeenCalledOnce()
  })
})
