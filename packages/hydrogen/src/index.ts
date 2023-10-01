import { Weaverse, type PlatformTypeEnum } from '@weaverse/react'
import type {
  HydrogenComponentInstance,
  HydrogenElement,
  HydrogenPageData,
  WeaverseHydrogenParams,
  WeaverseInternal,
  WeaverseLoaderRequestInfo,
} from './types'

export * from '@weaverse/react'
export * from './WeaverseHydrogenRoot'
export * from './client'
export * from './hooks/use-theme-settings'
export * from './types'
export * from './utils'
export * from './wrappers'

export class WeaverseHydrogen extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-hydrogen'
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  declare data: HydrogenPageData
  declare itemInstances: Map<string | number, HydrogenComponentInstance>
  declare elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams) {
    let { internal, pageId, requestInfo, ...coreParams } = params
    super(coreParams)
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
  }

  registerElement(element: HydrogenElement) {
    super.registerElement(element)
  }
}
