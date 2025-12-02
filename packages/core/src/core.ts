/*
  @weaverse/core is the core package of Weaverse SDKs, it contains the core logic of Weaverse.
  It is a singleton class that can be used to register item, store project data, trigger update on item or project data, etc.

  v5.8.4 Architectural Changes:
  - Removed Stitches CSS-in-JS library for simplified styling approach
  - Removed platformType property for unified component rendering
  - Uses className-based styling instead of dynamic CSS generation

  ---
  Licensed under MIT License.
  Source: https://github.com/weaverse/weaverse
  About Weaverse: https://weaverse.io
*/

import { createRef, type RefObject } from 'react'
import { version } from '../package.json'
import type {
  BreakPoints,
  ElementCSS,
  ElementData,
  WeaverseCoreParams,
  WeaverseProjectDataType,
} from './types'
import { merge } from './utils'
import { EventEmitter } from './utils/event-emitter'

export class WeaverseItemStore extends EventEmitter {
  weaverse: Weaverse
  ref: RefObject<HTMLElement | null> = createRef<HTMLElement | null>()
  _store: ElementData = { id: '', type: '' }

  constructor(initialData: ElementData, weaverse: Weaverse) {
    super()
    const { type, id } = initialData || {}
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
    const defaultCss = this.Element?.defaultCss || {}
    const currentCss = this._store.css || {}
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
  weaverseVersion = version
  sdkVersion = version
  projectId = ''
  isDesignMode = false
  isPreviewMode = false
  studioBridge?: any
  declare static ItemConstructor: typeof WeaverseItemStore
  declare data: WeaverseProjectDataType
  declare dataContext: Record<string, unknown> | null
  static elementRegistry = new Map()

  static mediaBreakPoints: BreakPoints = {
    desktop: 'all',
    // max-width need to subtract 0.02px to prevent bug
    // ref: https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    mobile: '(max-width: 767.98px)',
  }

  constructor(params: WeaverseCoreParams) {
    super()
    // Note: platformType parameter was removed in v5.8.4
    // Components now use unified rendering approach without platform-specific logic
    for (const param of Object.entries(params)) {
      const [key, value] = param
      this[key] = value || this[key]
    }
    this.initProject()
  }

  getSnapShot = () => this.data
  /**
   * Create new `WeaverseItemStore` instance for each item in the project.
   */
  initProject = () => {
    const { data } = this
    const itemInstances = Weaverse.itemInstances
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
        const itemInstance = itemInstances.get(item.id)
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
  createItemInstance = (data: ElementData) =>
    new Weaverse.ItemConstructor(data, this)

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
