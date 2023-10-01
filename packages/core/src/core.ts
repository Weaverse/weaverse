/*
  @weaverse/core is the core package of Weaverse SDKs, it contains the core logic of Weaverse.
  It is a singleton class that can be used to register item, store project data, trigger update on item or project data, etc.
  ---
  Licensed under MIT License.
  Source: https://github.com/weaverse/sdks
  About Weaverse: https://weaverse.io
*/

import * as stitches from "@stitches/core"
import type Stitches from "@stitches/core/types/stitches"
import type { RefObject } from "react"
import type { BreakPoints, ElementData, PlatformTypeEnum, WeaverseCoreParams, WeaverseProjectDataType } from "./types"
import { getItemDefaultData, merge } from "./utils"
import { EventEmitter } from "./utils/event-emiiter"
import { stitchesUtils } from "./utils/stitches"

export class WeaverseItemStore extends EventEmitter {
  weaverse: Weaverse
  ref: RefObject<HTMLElement> = { current: null }
  private _store: ElementData = { id: "", type: "" }
  stitchesClass = ""

  constructor(itemData: ElementData, weaverse: Weaverse) {
    super()
    let { type, id } = itemData
    this.weaverse = weaverse
    if (id && type) {
      weaverse.itemInstances.set(id, this)
      if (weaverse.platformType === "shopify-hydrogen") {
        let { data, ...rest } = itemData
        this._store = { ...data, ...rest }
      } else {
        this._store = { ...itemData }
      }
    }
  }

  get _id() {
    return this._store.id
  }

  get _element() {
    return this.ref.current
  }

  get _flags() {
    return this.Element?.schema?.flags || {}
  }

  get Element() {
    return this.weaverse.elementRegistry.get(this._store.type)
  }

  set data(update: Omit<ElementData, "id" | "type">) {
    this._store = { ...this.data, ...update }
  }

  get data(): ElementData {
    let defaultData = getItemDefaultData(this)
    let defaultCss = this.Element?.defaultCss || {}
    let currentCss = this._store.css || {}
    let css = merge(defaultCss, currentCss)
    let extraData = this.Element?.extraData
    return { ...defaultData, ...extraData, ...this._store, css }
  }

  setData = (update: Omit<ElementData, "id" | "type">) => {
    this.data = Object.assign(this.data, update)
    this.triggerUpdate()
    return this.data
  }

  triggerUpdate = () => {
    this.emit(this.data)
  }
}

export class Weaverse extends EventEmitter {
  contentRootElement: HTMLElement | null = null
  itemInstances = new Map()
  weaverseHost = "https://weaverse.io"
  weaverseVersion = ""
  projectId = ""
  isDesignMode = false
  isPreviewMode = false
  stitchesInstance: Stitches | any
  studioBridge?: any

  declare data: WeaverseProjectDataType
  declare platformType: PlatformTypeEnum
  static WeaverseItemStore: typeof WeaverseItemStore = WeaverseItemStore
  readonly elementRegistry = new Map()

  mediaBreakPoints: BreakPoints = {
    desktop: "all",
    // max-width need to subtract 0.02px to prevent bug
    // ref: https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    mobile: "(max-width: 767.98px)",
  }

  constructor(params: WeaverseCoreParams = {}) {
    super()
    Object.entries(params).forEach(([k, v]) => {
      let key = k as keyof typeof this
      this[key] = v || this[key]
    })
    this.initProject()
    this.initStitches()
  }

  /**
   * Create new `WeaverseItemStore` instance for each item in the project.
   */
  initProject() {
    let data = this.data
    if (data?.items) {
      data.items.forEach((item) => {
        if (!this.itemInstances.get(item.id)) {
          return new WeaverseItemStore(item, this)
        } else {
          let itemInstance = this.itemInstances.get(item.id)
          itemInstance.setData(item)
        }
      })
    }
  }

  initStitches = (externalConfig?: stitches.CreateStitches) => {
    this.stitchesInstance =
      this.stitchesInstance ||
      stitches.createStitches({
        prefix: "weaverse",
        media: this.mediaBreakPoints,
        utils: stitchesUtils,
        ...externalConfig,
      })
  }

  /**
   * Register the custom React Component to Weaverse, store it into Weaverse.elementRegistry
   */
  registerElement(element: { type: string }) {
    if (element?.type) {
      if (!this.elementRegistry.has(element.type)) {
        this.elementRegistry.set(element?.type, element)
      } else {
        console.warn(`Element with type '${element.type}' already exists.`)
      }
    } else {
      console.error("Cannot register element without 'type'.")
    }
  }

  triggerUpdate() {
    this.emit()
  }

  refreshAllItems() {
    this.itemInstances.forEach((item) => {
      item.triggerUpdate()
    })
  }

  /**
   * Reset the project data and re-initialize all items.
   * Used when we need to re-render the project with new data (like applying new template)
   * @param data {WeaverseProjectDataType}
   */
  setProjectData(data: WeaverseProjectDataType) {
    this.data = data
    this.initProject()
  }
}
