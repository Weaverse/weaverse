/*
  @weaverse/core is the core package of Weaverse SDKs, it contains the core logic of Weaverse.
  It is a singleton class that can be used to register item, store project data, trigger update on item or project data, etc.
  ---
  Licensed under MIT License.
  Source: https://github.com/weaverse/weaverse
  About Weaverse: https://weaverse.io
*/

import * as stitches from '@stitches/core'
import type Stitches from '@stitches/core/types/stitches'
import { createRef, type RefObject } from 'react'
import pkg from '../package.json'
import type {
  BreakPoints,
  ElementCSS,
  ElementData,
  PlatformTypeEnum,
  WeaverseCoreParams,
  WeaverseProjectDataType,
} from './types'
import { merge } from './utils'
import { EventEmitter } from './utils/event-emitter'
import { stitchesUtils } from './utils/stitches'

export class WeaverseItemStore extends EventEmitter {
  weaverse: Weaverse
  ref: RefObject<HTMLElement | null> = createRef<HTMLElement | null>()
  _store: ElementData = { id: '', type: '' }
  stitchesClass = ''

  constructor(initialData: ElementData, weaverse: Weaverse) {
    super()
    let { type, id } = initialData || {}
    this.weaverse = weaverse
    if (id && type) {
      Weaverse.itemInstances.set(id, this)
      Object.assign(this._store, initialData)
    } else {
      throw new Error(
        `'id' and 'type' are required to create a new Weaverse item.`
      )
    }
    this._store.css = this.getDefaultCss()
  }

  get _id() {
    return this._store.id
  }

  get _element() {
    return this.ref.current
  }

  get Element() {
    return this.weaverse.elementRegistry.get(this._store.type)
  }

  getDefaultCss = (): ElementCSS => {
    let defaultCss = this.Element?.defaultCss || {}
    let currentCss = this._store.css || {}
    return merge(defaultCss, currentCss)
  }

  get data(): ElementData {
    return this._store
  }

  set data(update: Omit<ElementData, 'id' | 'type'>) {
    this._store = { ...this._store, ...update }
  }

  setData = (update: Omit<ElementData, 'id' | 'type'>) => {
    this.data = update
    this.triggerUpdate()
    return this.data
  }

  getSnapShot = () => this.data

  triggerUpdate = () => {
    this.emit(this._store)
  }
}

export class Weaverse extends EventEmitter {
  contentRootElement: HTMLElement | null = null
  static itemInstances = new Map()
  weaverseHost = 'https://studio.weaverse.io'
  weaverseVersion = pkg.version
  projectId = ''
  isDesignMode = false
  isPreviewMode = false
  static stitchesInstance: Stitches | any
  studioBridge?: any

  declare static ItemConstructor: typeof WeaverseItemStore
  declare data: WeaverseProjectDataType
  declare platformType: PlatformTypeEnum
  static elementRegistry = new Map()

  static mediaBreakPoints: BreakPoints = {
    desktop: 'all',
    // max-width need to subtract 0.02px to prevent bug
    // ref: https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    mobile: '(max-width: 767.98px)',
  }

  constructor(params: WeaverseCoreParams) {
    super()
    for (const param of Object.entries(params)) {
      let [key, value] = param
      this[key] = value || this[key]
    }
    this.initProject()
    Weaverse.initStitches()
  }

  getSnapShot = () => {
    return this.data
  }
  /**
   * Create new `WeaverseItemStore` instance for each item in the project.
   */
  initProject = () => {
    let { data } = this
    let itemInstances = Weaverse.itemInstances
    if (data?.items) {
      // data.items.forEach((item) => {
      //   let itemInstance = itemInstances.get(item.id)
      //   if (itemInstance) {
      //     itemInstance.setData(item)
      //   } else {
      //     this.createItemInstance(item)
      //   }
      // })
      for (const item of data.items) {
        let itemInstance = itemInstances.get(item.id)
        if (itemInstance) {
          itemInstance.setData(item)
        } else {
          this.createItemInstance(item)
        }
      }
    }
  }

  get itemInstances() {
    return Weaverse.itemInstances
  }
  createItemInstance = (data: ElementData) => {
    return new Weaverse.ItemConstructor(data, this)
  }

  static initStitches = (externalConfig?: stitches.CreateStitches) => {
    Weaverse.stitchesInstance =
      Weaverse.stitchesInstance ||
      stitches.createStitches({
        prefix: 'weaverse',
        media: Weaverse.mediaBreakPoints,
        utils: stitchesUtils,
        ...externalConfig,
      })
  }

  get stitchesInstance() {
    return Weaverse.stitchesInstance
  }

  /**
   * Register the custom React Component to Weaverse, store it into Weaverse.elementRegistry
   */
  static registerElement = registerElement

  get elementRegistry() {
    return Weaverse.elementRegistry
  }

  triggerUpdate = () => {
    // make new copy of data to trigger update
    this.data = { ...this.data }
    this.emit(this.data)
  }

  refreshAllItems() {
    for (const item of Weaverse.itemInstances.values()) {
      item.triggerUpdate()
    }
  }

  /**
   * Reset the project data and re-initialize all items.
   * Used when we need to re-render the project with new data (like applying new template)
   * @param data {WeaverseProjectDataType}
   */
  setProjectData = (data: WeaverseProjectDataType) => {
    this.data = data
    this.initProject()
  }
}
export function registerElement(element: { type: string; [x: string]: any }) {
  if (element?.type) {
    if (!Weaverse.elementRegistry.has(element.type)) {
      Weaverse.elementRegistry.set(element?.type, element)
    }
  } else {
    console.error("Cannot register element without 'type'.")
  }
}

export { EventEmitter }
