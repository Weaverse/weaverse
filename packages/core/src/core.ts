// TODO: Implement Weaverse SDK class
// Only core code is implemented here, avoid importing other packages,
// the core code should be framework agnostic, no react, vue, angular, etc.
// noinspection JSUnusedGlobalSymbols

// using stitches core only for framework-agnostic code
import * as stitches from "@stitches/core"
import type Stitches from "@stitches/core/types/stitches"
import type { RefObject } from "react"
import type {
  BreakPoints,
  ElementData,
  ElementSchema,
  PlatformTypeEnum,
  WeaverseElement,
  WeaverseProjectDataType,
  WeaverseType,
} from "./types"
import { merge } from "./utils"
import { stitchesUtils } from "./utils/styles"

export class WeaverseItemStore {
  weaverse: Weaverse
  listeners: Set<(_: ElementData) => void> = new Set()
  ref: RefObject<HTMLElement> = { current: null }
  stitchesClass = ""
  private _store: ElementData = { id: "", type: "" }

  constructor(itemData: ElementData, weaverse: Weaverse) {
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
    return this.weaverse.elementInstances.get(this._store.type)
  }

  set data(update: Omit<ElementData, "id" | "type">) {
    // if (this.weaverse.platformType === "shopify-hydrogen") {
    //   let { children, ...rest } = update
    //   if (children) {
    //     this._store.children = children
    //   }
    //   this._store.data = merge(this._store.data, rest)
    // } else {
    //   this._store = { ...this.data, ...update }
    // }
    this._store = { ...this.data, ...update }
  }

  get data(): ElementData {
    let defaultProps = { ...this.Element?.Component?.defaultProps }
    // if (this.platformType === "shopify-hydrogen") {
    //   return {
    //     ...defaultProps,
    //     ...this._store,
    //     data: { ...defaultProps?.data, ...this._store.data },
    //   }
    // } else {
    //   let defaultCss = this.Element?.defaultCss || {}
    //   let currentCss = this._store.css || {}
    //   let css = merge(defaultCss, currentCss)
    //   let extraData = this.Element?.extraData
    //   return { ...defaultProps, ...extraData, ...this._store, css }
    // }
    let defaultCss = this.Element?.defaultCss || {}
    let currentCss = this._store.css || {}
    let css = merge(defaultCss, currentCss)
    let extraData = this.Element?.extraData
    return { ...defaultProps, ...extraData, ...this._store, css }
  }

  setData = (update: Omit<ElementData, "id" | "type">) => {
    // if (this.weaverse.platformType === "shopify-hydrogen") {
    //   this.data = update
    // } else {
    //   this.data = Object.assign(this.data, update)
    // }
    this.data = Object.assign(this.data, update)

    this.triggerUpdate()
    return this.data
  }

  subscribe = (fn: (_: ElementData) => void) => {
    this.listeners.add(fn)
  }

  unsubscribe = (fn: (_: ElementData) => void) => {
    this.listeners.delete(fn)
  }

  triggerUpdate = () => {
    this.listeners.forEach((fn) => {
      return fn(this.data)
    })
  }
}

export class Weaverse {
  /**
   * The `weaverse-content-root` element of Weaverse SDK
   */
  contentRootElement: HTMLElement | undefined
  /**
   * For storing, registering element React component from Weaverse or created by user/developer
   */
  elementInstances = new Map<string, WeaverseElement>()
  /**
   * list of element/items store to provide data, handle state update, state sharing, etc.
   */
  itemInstances = new Map<string | number, WeaverseItemStore>()
  /**
   * Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   */
  weaverseHost = "https://weaverse.io"
  /**
   * Weaverse version, it can be used to load the correct version of Weaverse SDK
   */
  weaverseVersion = ""
  /**
   * Weaverse project key to access project data via API
   */
  projectId = ""

  pageId = ""
  /**
   * Weaverse project data, by default, user can provide project data via React Component:
   * <WeaverseRoot data={data} /> it will be used to server-side rendering
   */
  data: WeaverseProjectDataType = {
    rootId: "",
    items: [],
    script: { css: "", js: "" },
  }
  /**
   * Storing subscribe callback function for any component that want to listen to the change of WeaverseRoot
   */
  listeners: Set<() => void> = new Set()
  /**
   * Check whether the sdk is in editor or not.
   * If isDesignMode is true, it means the sdk is isDesignMode mode, render the editor UI,
   * else render the preview UI, plain HTML + CSS + React hydrate
   */
  isDesignMode = false

  /**
   * Check the platform, shopify-section or react-ssr(hydrogen)
   */
  platformType: PlatformTypeEnum = "shopify-section"

  /**
   * Check whether the sdk is in preview mode or not
   */
  isPreviewMode = false

  /**
   * Use in element to optionally render special HTML for hydration
   */
  ssrMode = false
  /**
   * Stitches instance for handling CSS stylesheet, media, theme for Weaverse project
   */
  stitchesInstance: Stitches | any

  studioBridge?: any
  elementSchemas: ElementSchema[] = []
  static WeaverseItemStore: typeof WeaverseItemStore = WeaverseItemStore

  mediaBreakPoints: BreakPoints = {
    desktop: "all",
    // max-width need to subtract 0.02px to prevent bug https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    // tablet: "(max-width: 1023.98px)", // to set css for tablet, {'@tablet' : { // css }},
    mobile: "(max-width: 767.98px)",
  }

  /**
   * constructor
   * @param weaverseHost {string} Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @param projectId {string} Weaverse project key to access project data via API
   * @param data {WeaverseProjectDataType} Weaverse project data, by default, user can provide project data via React Component.
   * @param mediaBreakPoints {object} Pass down custom media query breakpoints or just use the default.
   * @param isDesignMode {boolean} check whether the sdk is isDesignMode or not
   * @param ssrMode {boolean} Use in element to optionally render special HTML for hydration
   * @param elementSchemas {Array<ElementSchema>} List of element schemas
   * @param platformType {PlatformTypeEnum} Check the platform, shopify-section or react-ssr(hydrogen)
   */
  constructor(params: WeaverseType = {}) {
    Object.entries(params).forEach(([k, v]) => {
      let key = k as keyof typeof this
      this[key] = v || this[key]
    })
    this.initProject()
    this.initStitches()
  }

  /**
   * Register the custom React Component to Weaverse, store it into Weaverse.elementInstances
   * @param element {WeaverseElement} custom React Component
   */
  registerElement(element: WeaverseElement) {
    if (element?.type) {
      if (!this.elementInstances.has(element.type)) {
        this.elementInstances.set(element?.type, element)
      }
    } else {
      console.error("Weaverse: registerElement: `type` is required")
    }
  }

  initStitches = (externalConfig = {}) => {
    this.stitchesInstance =
      this.stitchesInstance ||
      stitches.createStitches({
        prefix: "weaverse",
        media: this.mediaBreakPoints,
        utils: stitchesUtils,
        ...externalConfig,
      })
  }

  subscribe(fn: any) {
    this.listeners.add(fn)
  }

  unsubscribe(fn: any) {
    this.listeners.delete(fn)
  }

  triggerUpdate() {
    this.listeners.forEach((fn) => fn())
  }
  refreshAllItems() {
    this.itemInstances.forEach((item) => {
      item.triggerUpdate()
    })
  }

  /**
   * When applying new template,
   * we need to reset the project data and re-initialize the project item data
   * @param data {WeaverseProjectDataType}
   */
  setProjectData(data: WeaverseProjectDataType) {
    this.data = data
    this.initProject()
    this.triggerUpdate()
  }

  /**
   * Create new WeaverseItemStore instance for each item in project data
   */
  initProject() {
    const data = this.data
    if (data?.items) {
      data.items.forEach((item) => {
        if (!this.itemInstances.get(item.id as string | number)) {
          return new WeaverseItemStore(item, this)
        }
      })
    }
  }
}
