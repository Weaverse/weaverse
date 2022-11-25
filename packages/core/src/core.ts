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
  ElementFlags,
  InitializeData,
  ProjectDataType,
  WeaverseElement,
  WeaverseType,
} from "./types"
import { createGlobalStyles, isIframe, stichesUtils } from "./utils"

/**
 * WeaverseItemStore is a store for Weaverse item, it can be used to subscribe/update the item data
 * @param itemData {ElementData} Weaverse item data
 * @param weaverse {Weaverse} Weaverse instance
 * @example
 * useEffect(() => {
 *     let handleUpdate = (update: any) => {
 *       setData({...update})
 *     }
 *     itemInstance.subscribe(handleUpdate)
 *     return () => {
 *       itemInstance.unsubscribe(handleUpdate)
 *     }
 * }, [])
 */
export class WeaverseItemStore {
  listeners: Set<any> = new Set()
  ref: RefObject<HTMLElement> = {
    current: null,
  }
  weaverse: Weaverse
  stitchesClass = ""
  _data: ElementData = { id: "", type: "" }
  _flags: ElementFlags = {}

  constructor(itemData: ElementData, weaverse: Weaverse) {
    let { type, id } = itemData
    this.weaverse = weaverse
    if (id && type) {
      weaverse.itemInstances.set(id, this)
      this.data = { ...itemData }
    }
  }

  get _id() {
    return this._data.id
  }
  get _element() {
    return this.ref.current
  }

  get Element() {
    return this.weaverse.elementInstances.get(this._data.type!)
  }

  set data(data: Omit<ElementData, "id" | "type">) {
    this._data = { ...this.data, ...data }
  }

  get data(): ElementData {
    let css = this.Element?.defaultCss
    let defaultData = { ...this.Element?.Component?.defaultProps, ...(css && { css }) }
    return { ...defaultData, ...this._data }
  }

  setData = (data: Omit<ElementData, "id" | "type">) => {
    this.data = Object.assign(this.data, data)
    this.triggerUpdate()
    return this.data
  }

  subscribe = (fn: any) => {
    this.listeners.add(fn)
  }

  unsubscribe = (fn: any) => {
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
   * @type {string}
   */
  appUrl: string = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://studio.weaverse.io"
  /**
   * Weaverse project key to access project data via API
   * @type {string}
   */
  projectKey = ""
  /**
   * Weaverse project data, by default, user can provide project data via React Component:
   * <WeaverseRoot defaultData={projectData} /> it will be used to server-side rendering
   */
  projectData: ProjectDataType = {
    rootId: "",
    items: [],
    script: { css: "", js: "" },
  }
  /**
   * storing subscribe callback function for any component that want to listen to the change of WeaverseRoot
   * @type {Map<string, (data: any) => void>}
   */
  listeners: Set<any> = new Set()
  /**
   * check whether the sdk is isDesignMode or not
   * if isDesignMode is true, it means the sdk is isDesignMode mode, render the editor UI
   * else render the preview UI, plain HTML + CSS + React hydrate
   * @type {boolean}
   */
  isDesignMode = false

  /**
   * Use in element to optionally render special HTML for hydration
   * @type {boolean}
   */
  ssrMode = false
  /**
   * stitches instance for handling CSS stylesheet, media, theme for Weaverse project
   */
  stitchesInstance: Stitches | any

  studioBridge?: any
  static WeaverseItemStore: typeof WeaverseItemStore = WeaverseItemStore

  mediaBreakPoints: BreakPoints = {
    desktop: "all",
    // max-width need to subtract 0.02px to prevent bug https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    // tablet: "(max-width: 1023.98px)", // to set css for tablet, {'@tablet' : { // css }},
    mobile: "(max-width: 767.98px)",
  }

  /**
   * constructor
   * @param appUrl {string} Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @param projectKey {string} Weaverse project key to access project data via API
   * @param projectData {ProjectDataType} Weaverse project data, by default, user can provide project data via React Component.
   * @param mediaBreakPoints {object} Pass down custom media query breakpoints or just use the default.
   * @param isDesignMode {boolean} check whether the sdk is isDesignMode or not
   * @param ssrMode {boolean} Use in element to optionally render special HTML for hydration
   */
  constructor({ appUrl, projectKey, projectData, mediaBreakPoints, isDesignMode, ssrMode }: WeaverseType = {}) {
    this.init({ appUrl, projectKey, projectData, mediaBreakPoints, isDesignMode, ssrMode })
  }

  init({ appUrl, projectKey, projectData, mediaBreakPoints, isDesignMode, ssrMode }: WeaverseType = {}) {
    this.appUrl = appUrl || this.appUrl
    this.projectKey = projectKey || this.projectKey
    this.mediaBreakPoints = mediaBreakPoints || this.mediaBreakPoints
    this.isDesignMode = isDesignMode || this.isDesignMode
    this.ssrMode = ssrMode || this.ssrMode
    this.projectData = projectData || this.projectData
    this.initStitches()
    this.initProjectItemData()
  }
  initialized = false
  initializeData = (data: InitializeData) => {
    if (!this.initialized) {
      let { data: pageData, published, id, projectKey, studioUrl } = data
      this.projectKey = projectKey || this.projectKey
      this.appUrl = studioUrl || this.appUrl
      this.projectData = { ...pageData, pageId: id }
      this.isDesignMode = !published
      this.initProjectItemData()
      if (this.isDesignMode) {
        this.triggerUpdate()
        this.loadStudio()
      }
    }
    this.initialized = true
  }

  loadStudio() {
    setTimeout(() => {
      if (isIframe && this.isDesignMode && !this.studioBridge) {
        const initStudio = () => {
          this.studioBridge = new window.WeaverseStudioBridge(this)
          // Make event listeners from studio work
          this.triggerUpdate()
        }

        if (!window.WeaverseStudioBridge) {
          // load studio bridge script by url: https://weaverse.io/assets/studio/studio-bridge.js
          const studioBridgeScript = document.createElement("script")
          studioBridgeScript.src = `${this.appUrl}/assets/studio/studio-bridge.js`
          studioBridgeScript.type = "module"
          studioBridgeScript.onload = initStudio
          document.body.appendChild(studioBridgeScript)
        } else {
          initStudio()
        }
      }
    }, 2000)
  }
  /**
   * register the custom React Component to Weaverse, store it into Weaverse.elementInstances
   * @param element {WeaverseElement} custom React Component
   */
  registerElement(element: WeaverseElement) {
    if (element?.type) {
      if (this.elementInstances.has(element.type)) {
        throw new Error(`Weaverse: Element '${element.type}' already registered`)
      }
      this.elementInstances.set(element?.type, element)
    } else {
      throw new Error("Weaverse: registerElement: `type` is required")
    }
  }

  initStitches = () => {
    this.stitchesInstance =
      this.stitchesInstance ||
      stitches.createStitches({
        prefix: "weaverse",
        media: this.mediaBreakPoints,
        utils: stichesUtils,
      })
    createGlobalStyles(this.stitchesInstance)
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

  /**
   * fetch data from Weaverse API (https://weaverse.io/api/v1/project/:projectKey)
   * @param fetch {fetch} custom fetch function, pass in custom fetch function if you want to use your own fetch function
   * @param appUrl
   * @param projectKey
   */
  static fetchProjectData({
    fetch = globalThis.fetch,
    appUrl,
    projectKey,
  }: {
    fetch?: any
    appUrl?: string
    projectKey?: string
  }) {
    return fetch(appUrl + `/api/public/project/${projectKey}`)
      .then((r: Response) => r.json())
      .catch(console.error)
  }
  setProjectData(projectData: ProjectDataType) {
    this.projectData = projectData
    this.initProjectItemData()
    this.triggerUpdate()
  }

  initProjectItemData() {
    const data = this.projectData
    if (data?.items) {
      data.items.forEach((item) => {
        if (!this.itemInstances.get(item.id as string | number)) {
          new WeaverseItemStore(item, this)
        }
      })
    }
  }
}
