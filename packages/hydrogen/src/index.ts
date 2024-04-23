import {
  Weaverse,
  WeaverseItemStore,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
  type PlatformTypeEnum,
} from '@weaverse/react'
import type {
  HydrogenComponentData,
  HydrogenElement,
  HydrogenPageData,
  WeaverseHydrogenParams,
  WeaverseInternal,
  WeaverseLoaderRequestInfo,
} from './types'
import { generateDataFromSchema } from './utils'

export * from './WeaverseHydrogenRoot'
export { useThemeSettings } from './hooks/use-theme-settings'
export * from './types'
export * from './utils'
export * from './weaverse-client'
export * from './wrappers'
export * from './placeholders'
export { useChildInstances, useItemInstance, useParentInstance, useWeaverse }

export class WeaverseHydrogen extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-hydrogen'
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  declare ItemConstructor: typeof WeaverseHydrogenItem
  declare data: HydrogenPageData
  static itemInstances: Map<string, WeaverseHydrogenItem>
  static elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams) {
    let { internal, pageId, requestInfo, ...coreParams } = params
    super({ ...coreParams })
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
  }
}

export class WeaverseHydrogenItem extends WeaverseItemStore {
  declare weaverse: WeaverseHydrogen

  constructor(initialData: HydrogenComponentData, weaverse: WeaverseHydrogen) {
    super(initialData, weaverse)
    let { data, ...rest } = initialData
    Object.assign(this._store, this._schemaData, data, rest)
  }

  get Element(): HydrogenElement {
    return super.Element
  }

  get _schemaData() {
    if (this.Element.schema) {
      return generateDataFromSchema(this.Element.schema)
    }
    return {}
  }
}

Weaverse.ItemConstructor = WeaverseHydrogenItem
