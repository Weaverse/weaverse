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
import type {
  BreakPoints,
  ElementCSS,
  ElementData,
  PlatformTypeEnum,
  WeaverseCoreParams,
  WeaverseProjectDataType,
} from "./types"
import { merge } from "./utils"
import { EventEmitter } from "./utils/event-emiiter"
import { stitchesUtils } from "./utils/stitches"

export class WeaverseItemStore extends EventEmitter {
  weaverse: Weaverse
  ref: RefObject<HTMLElement> = { current: null }
  _store: ElementData = { id: "", type: "" }
  stitchesClass = ""

  constructor(intialData: ElementData, weaverse: Weaverse) {
    super()
    let { type, id } = intialData || {}
    this.weaverse = weaverse
    if (id && type) {
      weaverse.itemInstances.set(id, this)
    } else {
      throw new Error(`'id' and 'type' are required to create a new Weaverse item.`)
    }
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

  get css(): ElementCSS {
    let defaultCss = this.Element?.defaultCss || {}
    let currentCss = this._store.css || {}
    let css = merge(defaultCss, currentCss)
    return css
  }

  get data(): ElementData {
    let css = this.css
    return { ...this._store, css }
  }

  set data(update: Omit<ElementData, "id" | "type">) {
    this._store = { ...this.data, ...update }
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

  declare ItemConstructor: typeof WeaverseItemStore
  declare data: WeaverseProjectDataType
  declare platformType: PlatformTypeEnum
  readonly elementRegistry = new Map()

  mediaBreakPoints: BreakPoints = {
    desktop: "all",
    // max-width need to subtract 0.02px to prevent bug
    // ref: https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    mobile: "(max-width: 767.98px)",
  }

  constructor(params: WeaverseCoreParams) {
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
  initProject = () => {
    let { data, itemInstances, ItemConstructor } = this
    if (data?.items) {
      data.items.forEach((item) => {
        let itemInstance = itemInstances.get(item.id)
        if (itemInstance) {
          itemInstance.setData(item)
        } else {
          new ItemConstructor(item, this)
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
  setProjectData = (data: WeaverseProjectDataType) => {
    this.data = data
    console.log("setProjectData", 2222, data)
    this.initProject()
  }
}
