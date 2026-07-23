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

/** Holds the mutable runtime state for one rendered Weaverse element. */
export class WeaverseItemStore extends EventEmitter {
  /** The Core runtime that owns this item. */
  weaverse: Weaverse

  /** React ref for the element's rendered HTML node. */
  ref: RefObject<HTMLElement | null> = createRef<HTMLElement | null>()

  /** The current serialized state of the element. */
  _store: ElementData = { id: '', type: '' }

  /** Creates an item store and registers it with the owning runtime. */
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

  /** The element's unique identifier. */
  get _id() {
    return this._store.id
  }

  /** The element's current rendered HTML node, if mounted. */
  get _element() {
    return this.ref.current
  }

  /** The registered component definition for this element type. */
  get Element() {
    return this.weaverse.elementRegistry.get(this._store.type)
  }

  /** Returns registered default styles merged with the element's saved styles. */
  getDefaultCss = (): ElementCSS => {
    const defaultCss = this.Element?.defaultCss || {}
    const currentCss = this._store.css || {}
    return merge(defaultCss, currentCss)
  }

  /**
   * The element's current serialized data. Assigning a value merges it into
   * the existing data.
   */
  get data(): ElementData {
    return this._store
  }

  // Setter behavior is documented on the getter, which owns the property's JSDoc.
  set data(update: Omit<ElementData, 'id' | 'type'>) {
    this._store = { ...this._store, ...update }
  }

  /** Applies an element data update and notifies subscribers. */
  setData = (update: Omit<ElementData, 'id' | 'type'>) => {
    this.data = update
    this.triggerUpdate()
    return this.data
  }

  /** Returns the element's current serialized data. */
  getSnapShot = () => this.data

  /** Notifies subscribers with the element's current data. */
  triggerUpdate = () => {
    this.emit(this._store)
  }
}

/** Coordinates project data, registered elements, and item stores at runtime. */
export class Weaverse extends EventEmitter {
  /** The DOM node containing the rendered project, if mounted. */
  contentRootElement: HTMLElement | null = null

  /** Item stores keyed by element identifier. */
  static itemInstances = new Map()

  /** Base URL of the Weaverse Studio host. */
  weaverseHost = 'https://studio.weaverse.io'

  /** Version of the Weaverse runtime. */
  weaverseVersion = version

  /** Version of the installed Core SDK. */
  sdkVersion = version

  /** Identifier of the project being rendered. */
  projectId = ''

  /** Whether the runtime is connected to Studio design mode. */
  isDesignMode = false

  /** Whether the runtime is rendering a preview. */
  isPreviewMode = false

  /** Optional bridge used to communicate with Weaverse Studio. */
  studioBridge?: any

  /** Item store class instantiated for serialized project items. */
  declare static ItemConstructor: typeof WeaverseItemStore

  /** The project's current serialized data. */
  declare data: WeaverseProjectDataType

  /** Optional application data exposed while rendering the project. */
  declare dataContext: Record<string, unknown> | null

  /** Component definitions keyed by element type. */
  static elementRegistry = new Map()

  /** Media queries used for responsive element styles. */
  static mediaBreakPoints: BreakPoints = {
    desktop: 'all',
    // max-width need to subtract 0.02px to prevent bug
    // ref: https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    mobile: '(max-width: 767.98px)',
  }

  /** Creates a Core runtime from serialized project data. */
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

  /** Returns the project's current serialized data. */
  getSnapShot = () => this.data

  /** Creates or updates an item store for every serialized project item. */
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

  /** Item stores keyed by element identifier. */
  get itemInstances() {
    return Weaverse.itemInstances
  }

  /** Creates an item store for serialized element data. */
  createItemInstance = (data: ElementData) =>
    new Weaverse.ItemConstructor(data, this)

  /** Registers a component definition for an element type. */
  static registerElement = registerElement

  /** Component definitions keyed by element type. */
  get elementRegistry() {
    return Weaverse.elementRegistry
  }

  /** Replaces the project data reference and notifies subscribers. */
  triggerUpdate = () => {
    // make new copy of data to trigger update
    this.data = { ...this.data }
    this.emit(this.data)
  }

  /** Notifies subscribers of every registered item store. */
  refreshAllItems() {
    for (const item of Weaverse.itemInstances.values()) {
      item.triggerUpdate()
    }
  }

  /** Replaces the project data and initializes its item stores. */
  setProjectData = (data: WeaverseProjectDataType) => {
    this.data = data
    this.initProject()
  }
}

/** Registers a component definition for its declared element type. */
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
