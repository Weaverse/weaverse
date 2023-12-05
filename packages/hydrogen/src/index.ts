import {
  Weaverse,
  WeaverseItemStore,
  useItemInstance,
  useChildInstances,
  useParentInstance,
  useWeaverse,
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

import { defaultComponents } from '~/components'

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
  declare static itemInstances: Map<string, WeaverseHydrogenItem>
  declare static elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams, components: HydrogenComponent[]) {
    console.log('💿 New WeaverseHydrogen', params)
    let { internal, pageId, requestInfo, ...coreParams } = params
    super({ ...coreParams, ItemConstructor: WeaverseHydrogenItem })
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
    this.registerComponents(components)
    this.registerComponents(defaultComponents)
  }

  registerComponents = (components: HydrogenComponent[]) => {
    components.forEach((comp) => {
      Weaverse.registerElement({
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

  constructor(initialData: HydrogenComponentData, weaverse: WeaverseHydrogen) {
    super(initialData, weaverse)
    let { data, ...rest } = initialData
    this._store = { ...data, ...rest }
  }

  get Element(): HydrogenElement {
    return super.Element
  }

  get data() {
    let defaultData = this.Element?.schema?.inspector
      ?.flatMap((group) => group.inputs)
      .reduce<Record<string, any>>((a, { defaultValue, name }) => {
        if (name && defaultValue !== null && defaultValue !== undefined) {
          a[name] = defaultValue
        }
        return a
      }, {})
    return { ...defaultData, ...super.data } as HydrogenComponentData
  }

  set data(update) {
    super.data = update
  }
}

export { useWeaverse, useItemInstance, useChildInstances, useParentInstance }
