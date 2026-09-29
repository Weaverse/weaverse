import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import type {
  CreateHydrogenSchemaOptions,
  HydrogenComponentSchema,
  HydrogenPageData,
  WeaverseHydrogenParams,
} from '../src/index'
import { createSchema, registerComponent, WeaverseHydrogen } from '../src/index'

const ROOT_ID = 'label-root'
const ITEM_ID = 'label-tile'

// Built through the public Hydrogen export so the package typecheck covers the
// `label` authoring contract, not just runtime behavior.
const TILE_SCHEMA: HydrogenComponentSchema = createSchema({
  type: 'hydrogen-label-tile',
  title: 'Tile',
  label: (data) => data.heading,
  settings: [
    {
      group: 'Content',
      inputs: [{ type: 'text', name: 'heading', defaultValue: 'Default tile' }],
    },
  ],
})

const ROOT_SCHEMA: HydrogenComponentSchema = createSchema({
  type: 'main',
  title: 'Main',
  settings: [],
})

function makeTranslatedPageData(
  itemData: Record<string, unknown>,
  translatedHeading: string
): HydrogenPageData {
  return {
    ...makePageData(itemData),
    translationMap: {
      [ITEM_ID]: {
        heading: {
          originalValue: String(itemData.heading),
          translatedValue: translatedHeading,
        },
      },
    },
  } as HydrogenPageData
}

function makePageData(itemData: Record<string, unknown>): HydrogenPageData {
  return {
    id: 'page-1',
    name: 'Page',
    rootId: ROOT_ID,
    items: [
      { id: ROOT_ID, type: 'main', data: {}, childIds: [ITEM_ID] },
      {
        id: ITEM_ID,
        type: TILE_SCHEMA.type,
        data: itemData,
        parentId: ROOT_ID,
      },
    ],
  } as unknown as HydrogenPageData
}

function makeInstance(
  itemData: Record<string, unknown>,
  data: HydrogenPageData = makePageData(itemData)
) {
  return new WeaverseHydrogen({
    data,
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

describe('Hydrogen label contract', () => {
  it('should_keep_hydrogen_schema_options_label_in_sync_with_schema_type', () => {
    expectTypeOf<CreateHydrogenSchemaOptions['label']>().toEqualTypeOf<
      HydrogenComponentSchema['label']
    >()
  })
})

describe('WeaverseHydrogen item labels', () => {
  beforeEach(() => {
    WeaverseHydrogen.itemInstances.clear()
    for (let schema of [TILE_SCHEMA, ROOT_SCHEMA]) {
      registerComponent({
        type: schema.type,
        Component: (() => null) as never,
        schema,
      })
    }
  })

  it('should_resolve_label_from_nested_serialized_data', () => {
    let weaverse = makeInstance({ heading: 'Summer sale' })

    let label = weaverse.getItemLabel(ITEM_ID)

    expect(label).toBe('Summer sale')
  })

  it('should_reflect_new_locale_data_when_reused_item_receives_it', () => {
    let weaverse = makeInstance({ heading: 'Summer sale' })

    weaverse.setProjectData(makePageData({ heading: 'Soldes d’été' }))

    expect(weaverse.getItemLabel(ITEM_ID)).toBe('Soldes d’été')
  })

  it('should_use_current_runtime_translations_when_new_runtime_reuses_item', () => {
    let base = { heading: 'Summer sale' }
    makeInstance(base, makeTranslatedPageData(base, 'Français'))

    let german = makeInstance(base, makeTranslatedPageData(base, 'Übersetzt'))

    expect(german.getItemLabel(ITEM_ID)).toBe('Übersetzt')
  })

  it('should_drop_translations_when_new_page_data_has_no_sidecar', () => {
    let base = { heading: 'Summer sale' }
    let weaverse = makeInstance(base, makeTranslatedPageData(base, 'Français'))

    weaverse.setProjectData(makePageData(base))

    expect(weaverse.getItemLabel(ITEM_ID)).toBe('Summer sale')
  })
})

// Settings without a `defaultValue`, declared through `settings` and through
// the legacy `inspector` key.
const PLAIN_TILE_SCHEMA: HydrogenComponentSchema = createSchema({
  type: 'hydrogen-label-plain-tile',
  title: 'Tile',
  label: (data) => data.heading,
  settings: [{ group: 'Content', inputs: [{ type: 'text', name: 'heading' }] }],
})

const LEGACY_TILE_SCHEMA: HydrogenComponentSchema = createSchema({
  type: 'hydrogen-label-legacy-tile',
  title: 'Tile',
  label: (data) => data.heading,
  inspector: [
    { group: 'Content', inputs: [{ type: 'text', name: 'heading' }] },
  ],
})

function makePlainPage(
  type: string,
  item: Record<string, unknown>
): HydrogenPageData {
  return {
    id: 'page-1',
    name: 'Page',
    rootId: ROOT_ID,
    items: [
      { id: ROOT_ID, type: 'main', data: {}, childIds: [ITEM_ID] },
      { id: ITEM_ID, type, parentId: ROOT_ID, ...item },
    ],
  } as unknown as HydrogenPageData
}

describe('WeaverseHydrogen full replacement of settings without defaults', () => {
  beforeEach(() => {
    WeaverseHydrogen.itemInstances.clear()
    for (let schema of [PLAIN_TILE_SCHEMA, LEGACY_TILE_SCHEMA, ROOT_SCHEMA]) {
      registerComponent({
        type: schema.type,
        Component: (() => null) as never,
        schema,
      })
    }
  })

  it.each([
    ['settings_empty_data', PLAIN_TILE_SCHEMA.type, { data: {} }],
    ['settings_omitted_data', PLAIN_TILE_SCHEMA.type, {}],
    ['inspector_empty_data', LEGACY_TILE_SCHEMA.type, { data: {} }],
  ])('should_fall_back_to_title_when_full_payload_clears_setting_%s', (_, type, item) => {
    let old = makePlainPage(type, { data: { heading: 'Old locale' } })
    let weaverse = makeInstance({}, old)

    weaverse.setProjectData(makePlainPage(type, item))

    expect(weaverse.getItemLabel(ITEM_ID)).toBe('Tile')
  })

  it('should_follow_each_payload_when_populated_empty_populated_repeat', () => {
    let type = PLAIN_TILE_SCHEMA.type
    let weaverse = makeInstance(
      {},
      makePlainPage(type, { data: { heading: 'A' } })
    )
    let labels: (string | undefined)[] = []

    for (let data of [{}, { heading: 'B' }, {}]) {
      weaverse.setProjectData(makePlainPage(type, { data }))
      labels.push(weaverse.getItemLabel(ITEM_ID))
    }

    expect(labels).toEqual(['Tile', 'B', 'Tile'])
  })

  it('should_match_fresh_store_when_reused_store_gets_same_full_payload', () => {
    let type = PLAIN_TILE_SCHEMA.type
    let payload = makePlainPage(type, { data: {} })
    makeInstance({}, payload)
    let fresh = { ...WeaverseHydrogen.itemInstances.get(ITEM_ID)?.data }
    WeaverseHydrogen.itemInstances.clear()
    let weaverse = makeInstance(
      {},
      makePlainPage(type, { data: { heading: 'Old' } })
    )

    weaverse.setProjectData(payload)

    expect(weaverse.itemInstances.get(ITEM_ID)?.data).toStrictEqual(fresh)
  })

  it('should_keep_settings_when_loader_data_update_arrives', () => {
    let type = PLAIN_TILE_SCHEMA.type
    let weaverse = makeInstance(
      {},
      makePlainPage(type, { data: { heading: 'Kept' } })
    )

    weaverse.itemInstances.get(ITEM_ID)?.setData({ loaderData: { ok: true } })

    expect(weaverse.getItemLabel(ITEM_ID)).toBe('Kept')
  })
})
