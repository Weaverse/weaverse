import {
  type PlatformTypeEnum,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
  Weaverse,
  WeaverseItemStore
} from '@weaverse/react'

import type {
  HydrogenComponent,
  HydrogenComponentData,
  HydrogenElement,
  HydrogenPageData,
  WeaverseHydrogenParams,
  WeaverseInternal,
  WeaverseLoaderRequestInfo
} from './types'

export * from './WeaverseHydrogenRoot'
export * from './weaverse-client'
export * from './hooks/use-theme-settings'
export * from './types'
export * from './utils'
export * from './wrappers'


export let registerComponents = (components: HydrogenComponent[]) => {
  components.forEach((comp) => {
    WeaverseHydrogen.registerElement({
      type: comp?.schema?.type,
      Component: comp?.default,
      schema: comp?.schema,
      loader: comp?.loader
    })
  })
}

export class WeaverseHydrogen extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-hydrogen'
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  declare ItemConstructor: typeof WeaverseHydrogenItem
  declare data: HydrogenPageData
  declare static itemInstances: Map<string, WeaverseHydrogenItem>
  declare static elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams) {
    let {internal, pageId, requestInfo, ...coreParams} = params
    super({...coreParams, ItemConstructor: WeaverseHydrogenItem})
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
  }
}

export class WeaverseHydrogenItem extends WeaverseItemStore {
  declare weaverse: WeaverseHydrogen

  constructor(initialData: HydrogenComponentData, weaverse: WeaverseHydrogen) {
    super(initialData, weaverse)
    let {data, ...rest} = initialData
    this._store = {...this.getDefaultData, ...data, ...rest}
  }

  get Element(): HydrogenElement {
    return super.Element
  }

  getDefaultData = () => {
    return this.Element?.schema?.inspector
      ?.flatMap((group) => group.inputs)
      .reduce<Record<string, any>>((a, {defaultValue, name}) => {
        if (name && defaultValue !== null && defaultValue !== undefined) {
          a[name] = defaultValue
        }
        return a
      }, {})
  }
}

export {useWeaverse, useItemInstance, useChildInstances, useParentInstance}
