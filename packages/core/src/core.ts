// TODO: Implement Weaverse SDK class
// Only core code is implemented here, avoid importing other packages,
// the core code should be framework agnostic, no react, vue, angular, etc.
import fetch from 'isomorphic-unfetch'
import * as process from 'process'
import StudioBridge from './studio-bridge'
import Stitches from '@stitches/core/types/stitches'
// stitches problem, we should use require instead of import
// using stitches core only for framework-agnostic code
let stitches = require('@stitches/core')


export interface ProjectDataItemType {
  type: string
  name?: string
  id: string | number
  description?: string
  childIds?: Array<string | number>
  css?: {
    [key: string]: string
  }
}

export interface ProjectDataType {
  items: ProjectDataItemType[]
}


export type WeaverseType = {
  [key: string]: any
  appUrl?: string,
  projectKey?: string,
  projectData?: ProjectDataType
}


export class Weaverse {
  /**
   * For storing, registering element React component from Weaverse or created by user/developer
   * @type {Map<string, React.Component>}
   */
  elementInstances = new Map<string, any>()
  /**
   * list of element/items store to provide data, handle state update, state sharing, etc.
   * @type {Map<string, any>}
   */
  itemInstances = new Map<string | number, WeaverseItemStore>()
  /**
   * Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @type {string}
   */
  appUrl: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://weaverse.io'
  /**
   * Weaverse project key to access project data via API
   * @type {string}
   */
  projectKey: string = ''
  /**
   * Weaverse project data, by default, user can provide project data via React Component:
   * <WeaverseRoot defaultData={projectData} /> it will be used to server-side rendering
   */
  projectData: ProjectDataType = {
    items: []
  }
  /**
   * storing subscribe callback function for any component that want to listen to the change of WeaverseRoot
   * @type {Map<string, (data: any) => void>}
   */
  listeners: Set<any> = new Set()
  /**
   * check whether the sdk is inEditor or not
   * if isEditor is true, it means the sdk is inEditor mode, render the editor UI
   * else render the preview UI, plain HTML + CSS + React hydrate
   * @type {boolean}
   */
  isEditor = false
  /**
   * stitches instance for handling CSS stylesheet, media, theme for Weaverse project
   */
  stitchesInstance: Stitches | any

  studioBridge?: StudioBridge

  /**
   * constructor
   * @param appUrl {string} Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @param projectKey {string} Weaverse project key to access project data via API
   * @param projectData {ProjectDataType} Weaverse project data, by default, user can provide project data via React Component.
   */
  constructor({appUrl, projectKey, projectData}: WeaverseType = {}) {
    this.appUrl = appUrl || this.appUrl
    this.projectKey = projectKey || this.projectKey
    projectData && (this.projectData = projectData)
    this.init()
  }

  /**
   * register the custom React Component to Weaverse, store it into Weaverse.elementInstances
   * @param name {string} unique name of the custom React Component
   * @param element {React.Component} custom React Component
   */
  registerElement(name: string, element: any) {
    this.elementInstances.set(name, element)
  }

  init() {
    // init the stitches instance
    this.stitchesInstance = stitches.createStitches(
      {
        prefix: 'weaverse',
        media: {
          bp1: '(min-width: 640px)',
          bp2: '(max-width: 768px)',
          bp3: '(min-width: 1024px)'
        }
      }
    )
  }

  loadStudio() {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    // only load studio bridge if it's in editor mode
    if (process.env.NODE_ENV !== 'production') {
      // TODO: separate studio bridge into a separate package
      // in development mode, we should use localhost:3000 as appUrl
      // this.appUrl = 'http://localhost:3000'
      // let StudioBridge = require('./studio-bridge')
      this.studioBridge = new StudioBridge(this)
      console.log('Weaverse: init studio bridge', this.studioBridge)

      this.studioBridge.subscribeMessageEvent()
      return true
    }
    return false
  }

  subscribe(fn: any) {
    this.listeners.add(fn)
  }

  unsubscribe(fn: any) {
    this.listeners.delete(fn)
  }

  triggerUpdate() {
    this.listeners.forEach(fn => fn())
    this.triggerEditorUpdate()
  }

  /**
   * fetch data from Weaverse API (https://weaverse.io/api/v1/projects/:projectKey)
   */
  fetchProjectData() {
    return fetch(this.appUrl + `/api/public/${this.projectKey}`).then(r => r.json()).catch(console.error)
  }

  /**
   * fetch and update the project data, then trigger update to re-render the WeaverseRoot
   */
  updateProjectData() {
    console.log('this.projectData', this.projectData)
    this.initItemData()
    this.triggerUpdate()
    return
    if (this.projectKey) {
      this.fetchProjectData().then(data => {
        if (data) {
          this.projectData = data
          this.initItemData()
          this.triggerUpdate()
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }


  triggerEditorUpdate(type = 'weaverse.workspace.init') {
    if (this.isEditor) {
      window.top?.postMessage({
        type, payload: {
          projectKey: this.projectKey,
          projectData: this.projectData
        }
      }, '*')
    }
  }

  initItemData() {
    let data = this.projectData
    if (data.items) {
      data.items.forEach(item => {
        let itemStore = this.itemInstances.get(item.id) || new WeaverseItemStore(item, this)
        this.itemInstances.set(item.id, itemStore)
      })
    }
  }
}

/**
 * WeaverseItemStore is a store for Weaverse item, it can be used to subscribe/update the item data
 * @param itemData {ProjectDataItemType} Weaverse item data
 * @param weaverse {Weaverse} Weaverse instance
 * Usage:
 * ```jsx
 * useEffect(() => {
 *     let handleUpdate = (update: any) => {
 *       setData({...update})
 *     }
 *     itemInstance.subscribe(handleUpdate)
 *     return () => {
 *       itemInstance.unsubscribe(handleUpdate)
 *     }
 *   }, [])
 *   ```
 */
export class WeaverseItemStore {
  data: any = {}
  listeners: Set<any> = new Set()
  Component: any
  ref: any = {
    current: null
  }

  constructor(itemData: any = {}, weaverse: Weaverse) {
    this.data = itemData
    let {type} = itemData
    if (type) {
      this.Component = weaverse.elementInstances.get(type)
    }
  }

  setData = (data: any) => {
    this.data = Object.assign(this.data, data)
    this.triggerUpdate()
  }

  subscribe = (fn: any) => {
    this.listeners.add(fn)
  }

  unsubscribe = (fn: any) => {
    this.listeners.delete(fn)
  }

  triggerUpdate = () => {
    this.listeners.forEach(fn => {
      return fn(this.data)
    })
  }
}