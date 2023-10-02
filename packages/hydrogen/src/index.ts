import {
  Weaverse,
  WeaverseItemStore,
  type PlatformTypeEnum,
} from '@weaverse/react'
import type {
  HydrogenComponent,
  HydrogenComponentData,
  HydrogenElement,
  HydrogenPageData,
  WeaverseHydrogenParams,
  WeaverseInternal,
  WeaverseLoaderRequestInfo,
} from './types'

export * from './WeaverseHydrogenRoot'
export * from './weaverse-client'
export * from './hooks/use-theme-settings'
export * from './types'
export * from './utils'
export * from './wrappers'

export class WeaverseHydrogen extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-hydrogen'
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  declare ItemConstructor: typeof WeaverseHydrogenItem
  declare data: HydrogenPageData
  declare itemInstances: Map<string | number, WeaverseHydrogenItem>
  declare elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams, components: HydrogenComponent[]) {
    let { internal, pageId, requestInfo, ...coreParams } = params
    super({ ...coreParams, ItemConstructor: WeaverseHydrogenItem })
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
    this.registerComponents(components)
  }

  registerElement(element: HydrogenElement) {
    super.registerElement(element)
  }

  registerComponents(components: HydrogenComponent[]) {
    components.forEach((comp) => {
      this.registerElement({
        type: comp?.schema?.type,
        Component: comp?.default,
        schema: comp?.schema,
        loader: comp?.loader,
      })
    })
  }
}

export class WeaverseHydrogenItem extends WeaverseItemStore {
  declare weaverse: WeaverseHydrogen

  constructor(intialData: HydrogenComponentData, weaverse: WeaverseHydrogen) {
    super(intialData, weaverse)
    let { data, ...rest } = intialData
    this._store = { ...data, ...rest }
  }

  get Element(): HydrogenElement {
    return super.Element
  }

  get data() {
    let defaultData = this.Element?.schema?.inspector
      ?.flatMap((group) => group.inputs)
      ?.reduce<Record<string, any>>((a, { defaultValue, name }) => {
        if (name && defaultValue !== null && defaultValue !== undefined) {
          a[name] = defaultValue
        }
        return a
      }, {})
    return { ...defaultData, ...super.data } as HydrogenComponentData
  }
}
