import { Weaverse } from '@weaverse/react'
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import type {
  SchemaType,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextRuntime,
} from '../src/index'
import {
  createSchema,
  createWeaverseNextClient,
  createWeaverseNextRuntime,
} from '../src/index'

const ITEM_ID = 'label-tile'

const tileSchema = createSchema({
  type: 'next-label-tile',
  title: 'Tile',
  label: (data) => data.heading,
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'heading', defaultValue: 'Default tile' },
        { type: 'text', name: 'subheading', defaultValue: 'Default sub' },
      ],
    },
  ],
})

// Typed through Next's public exports so the package typecheck covers the
// `label` authoring and registration contract.
const tileComponent: WeaverseNextComponent = {
  default: () => null,
  schema: tileSchema,
}

function makePage(item: Partial<WeaverseNextComponentData> = {}) {
  return {
    id: 'label-page',
    rootId: ITEM_ID,
    items: [{ id: ITEM_ID, type: tileSchema.type, ...item }],
  }
}

function makeRuntime(heading: string) {
  let client = createWeaverseNextClient({
    projectId: 'proj-label',
    components: [tileComponent],
    requestContext: { isDesignMode: true, pathname: '/' },
  })
  return createWeaverseNextRuntime({
    client,
    data: { page: makePage({ data: { heading } }) },
  })
}

function getItem() {
  return Weaverse.itemInstances.get(ITEM_ID)
}

describe('Next label contract', () => {
  it('should_expose_label_callback_and_item_label_lookup_types', () => {
    expectTypeOf<WeaverseNextComponent['schema']['label']>().toEqualTypeOf<
      SchemaType['label']
    >()
    expectTypeOf<WeaverseNextRuntime['getItemLabel']>().toEqualTypeOf<
      (id: string) => string | undefined
    >()
  })
})

describe('WeaverseNextItem labels', () => {
  beforeEach(() => {
    Weaverse.itemInstances.clear()
  })

  it('should_resolve_label_from_nested_serialized_data', () => {
    let runtime = makeRuntime('Summer sale')

    let label = runtime.getItemLabel(ITEM_ID)

    expect(label).toBe('Summer sale')
  })

  it('should_reflect_current_data_when_item_is_edited', () => {
    let runtime = makeRuntime('Summer sale')

    getItem().setData({ heading: 'Winter sale' })

    expect(runtime.getItemLabel(ITEM_ID)).toBe('Winter sale')
  })

  it('should_reset_to_schema_default_when_full_payload_has_empty_data', () => {
    let runtime = makeRuntime('Old locale')

    runtime.setProjectData(makePage({ data: {} }))

    expect(runtime.getItemLabel(ITEM_ID)).toBe('Default tile')
  })

  it('should_reset_to_schema_default_when_full_payload_omits_data', () => {
    let runtime = makeRuntime('Old locale')

    runtime.setProjectData(makePage())

    expect(runtime.getItemLabel(ITEM_ID)).toBe('Default tile')
  })

  it('should_follow_each_payload_when_full_payloads_repeat', () => {
    let runtime = makeRuntime('English')
    let labels: (string | undefined)[] = []

    for (let data of [{ heading: 'Français' }, {}, { heading: 'Deutsch' }]) {
      runtime.setProjectData(makePage({ data }))
      labels.push(runtime.getItemLabel(ITEM_ID))
    }

    expect(labels).toEqual(['Français', 'Default tile', 'Deutsch'])
  })

  it('should_keep_other_settings_when_partial_edit_arrives', () => {
    makeRuntime('Summer sale')
    getItem().setData({ subheading: 'Edited sub' })

    getItem().setData({ heading: 'Edited heading' })

    expect({
      heading: getItem().data.heading,
      subheading: getItem().data.subheading,
    }).toEqual({ heading: 'Edited heading', subheading: 'Edited sub' })
  })

  it('should_keep_settings_and_swap_store_when_empty_refresh_arrives', () => {
    makeRuntime('Summer sale')
    let before = getItem().getSnapShot()

    getItem().setData({})

    expect({
      heading: getItem().data.heading,
      swapped: getItem().getSnapShot() !== before,
    }).toEqual({ heading: 'Summer sale', swapped: true })
  })

  it('should_keep_settings_when_loader_data_update_arrives', () => {
    makeRuntime('Summer sale')

    getItem().setData({ loaderData: { product: 'p1' } })

    expect(getItem().data.heading).toBe('Summer sale')
  })
})

// Settings without a `defaultValue`, declared through `settings` and through
// the legacy `inspector` key.
const plainTileSchema = createSchema({
  type: 'next-label-plain-tile',
  title: 'Tile',
  label: (data) => data.heading,
  settings: [{ group: 'Content', inputs: [{ type: 'text', name: 'heading' }] }],
})

const legacyTileSchema = createSchema({
  type: 'next-label-legacy-tile',
  title: 'Tile',
  label: (data) => data.heading,
  inspector: [
    { group: 'Content', inputs: [{ type: 'text', name: 'heading' }] },
  ],
})

function makePlainPage(
  type: string,
  item: Partial<WeaverseNextComponentData> = {}
) {
  return {
    id: 'label-page',
    rootId: ITEM_ID,
    items: [{ id: ITEM_ID, type, ...item }],
  }
}

function makePlainRuntime(
  type: string,
  item: Partial<WeaverseNextComponentData>
) {
  let client = createWeaverseNextClient({
    projectId: 'proj-label',
    components: [
      { default: () => null, schema: plainTileSchema },
      { default: () => null, schema: legacyTileSchema },
    ],
    requestContext: { isDesignMode: true, pathname: '/' },
  })
  return createWeaverseNextRuntime({
    client,
    data: { page: makePlainPage(type, item) },
  })
}

describe('WeaverseNextItem full replacement of settings without defaults', () => {
  beforeEach(() => {
    Weaverse.itemInstances.clear()
  })

  it.each([
    ['settings_empty_data', plainTileSchema.type, { data: {} }],
    ['settings_omitted_data', plainTileSchema.type, {}],
    ['inspector_empty_data', legacyTileSchema.type, { data: {} }],
  ])('should_fall_back_to_title_when_full_payload_clears_setting_%s', (_, type, item) => {
    let runtime = makePlainRuntime(type, { data: { heading: 'Old locale' } })

    runtime.setProjectData(makePlainPage(type, item))

    expect(runtime.getItemLabel(ITEM_ID)).toBe('Tile')
  })

  it('should_follow_each_payload_when_populated_empty_populated_repeat', () => {
    let type = plainTileSchema.type
    let runtime = makePlainRuntime(type, { data: { heading: 'A' } })
    let labels: (string | undefined)[] = []

    for (let data of [{}, { heading: 'B' }, {}]) {
      runtime.setProjectData(makePlainPage(type, { data }))
      labels.push(runtime.getItemLabel(ITEM_ID))
    }

    expect(labels).toEqual(['Tile', 'B', 'Tile'])
  })

  it('should_match_fresh_store_when_reused_store_gets_same_full_payload', () => {
    let type = plainTileSchema.type
    makePlainRuntime(type, { data: {} })
    let fresh = { ...getItem().data }
    Weaverse.itemInstances.clear()
    let runtime = makePlainRuntime(type, { data: { heading: 'Old' } })

    runtime.setProjectData(makePlainPage(type, { data: {} }))

    expect(getItem().data).toStrictEqual(fresh)
  })

  it('should_keep_settings_when_partial_data_edit_arrives', () => {
    makePlainRuntime(plainTileSchema.type, { data: { heading: 'Kept' } })

    getItem().setData({ data: { subtitle: 'Edited' } })

    expect(getItem().data.heading).toBe('Kept')
  })
})
