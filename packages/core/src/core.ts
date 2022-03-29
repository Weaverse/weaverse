// TODO: Implement Weaverse SDK class
// Only core code is implemented here, avoid importing other packages,
// the core code should be framework agnostic, no react, vue, angular, etc.
import type { WeaverseElement } from "./types";
import { isIframe } from "./utils";
// using stitches core only for framework-agnostic code
import * as stitches from "@stitches/core";
import Stitches from "@stitches/core/types/stitches";

export interface ProjectDataItemType {
  type: string;
  name?: string;
  id: string | number;
  description?: string;
  childIds?: Array<string | number>;
  css?: {
    [key: string]: string;
  };
}

export interface ProjectDataType {
  items: ProjectDataItemType[];
  rootId: string | number;
}

export type MediaBreakpoints = {
  tablet: string;
  mobile: string;
};
export type WeaverseType = {
  [key: string]: any;
  appUrl?: string;
  projectKey?: string;
  projectData?: ProjectDataType;
};

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
  data: any = {};
  listeners: Set<any> = new Set();
  Component: any;
  ref: any = {
    current: null,
  };

  constructor(itemData: any = {}, weaverse: Weaverse) {
    this.data = itemData;
    let { type, id } = itemData;
    if (type && id) {
      this.Component = weaverse.elementInstances.get(type);
      weaverse.itemInstances.set(id, this);
    }
  }

  setData = (data: any) => {
    this.data = Object.assign(this.data, data);
    this.triggerUpdate();
  };

  subscribe = (fn: any) => {
    this.listeners.add(fn);
  };

  unsubscribe = (fn: any) => {
    this.listeners.delete(fn);
  };

  triggerUpdate = () => {
    this.listeners.forEach((fn) => {
      return fn(this.data);
    });
  };
}

export class Weaverse {
  /**
   * For storing, registering element React component from Weaverse or created by user/developer
   * @type {Map<string, React.Component>}
   */
  elementInstances = new Map<string, WeaverseElement>();
  /**
   * list of element/items store to provide data, handle state update, state sharing, etc.
   * @type {Map<string, any>}
   */
  itemInstances = new Map<string | number, WeaverseItemStore>();
  /**
   * Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @type {string}
   */
  appUrl: string = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://weaverse.io";
  /**
   * Weaverse project key to access project data via API
   * @type {string}
   */
  projectKey: string = "";
  /**
   * Weaverse project data, by default, user can provide project data via React Component:
   * <WeaverseRoot defaultData={projectData} /> it will be used to server-side rendering
   */
  projectData: ProjectDataType = {
    items: [],
    rootId: 0,
  };
  /**
   * storing subscribe callback function for any component that want to listen to the change of WeaverseRoot
   * @type {Map<string, (data: any) => void>}
   */
  listeners: Set<any> = new Set();
  /**
   * check whether the sdk is inEditor or not
   * if isEditor is true, it means the sdk is inEditor mode, render the editor UI
   * else render the preview UI, plain HTML + CSS + React hydrate
   * @type {boolean}
   */
  isEditor = false;
  /**
   * stitches instance for handling CSS stylesheet, media, theme for Weaverse project
   */
  stitchesInstance: Stitches | any;

  studioBridge?: any;
  static WeaverseItemStore: typeof WeaverseItemStore = WeaverseItemStore;

  mediaBreakPoints = {
    // default is "all" and you don't need to specify it
    // max-width need to subtract 0.02px to prevent bug https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    tablet: "(max-width: 1023.98px)", // to set css for tablet, {'@tablet' : { // css }}
    mobile: "(max-width: 767.98px)",
  };

  /**
   * constructor
   * @param appUrl {string} Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @param projectKey {string} Weaverse project key to access project data via API
   * @param projectData {ProjectDataType} Weaverse project data, by default, user can provide project data via React Component.
   * @param mediaBreakPoints {object} Pass down custom media query breakpoints or just use the default.
   */
  constructor({ appUrl, projectKey, projectData, mediaBreakPoints }: WeaverseType = {}) {
    this.appUrl = appUrl || this.appUrl;
    this.projectKey = projectKey || this.projectKey;
    this.mediaBreakPoints = mediaBreakPoints || this.mediaBreakPoints;
    projectData && (this.projectData = projectData);
    this.init();
  }

  /**
   * register the custom React Component to Weaverse, store it into Weaverse.elementInstances
   * @param name {string} unique name of the custom React Component
   * @param element {React.Component} custom React Component
   */
  registerElement(element: WeaverseElement) {
    if (element?.schema?.type) {
      this.elementInstances.set(element.schema.type, element);
    } else {
      throw new Error("Weaverse: registerElement: schema.type is required");
    }
  }

  init() {
    this.initStitches();
    this.loadStudio();
  }

  initStitches = () => {
    // init the stitches instance
    this.stitchesInstance = stitches.createStitches({
      prefix: "we",
      media: this.mediaBreakPoints,
    });
  };
  loadStudio() {
    if (isIframe) {
      window.addEventListener("message", (e) => {
        if (e.data?.type === "weaverse.preview.initializeEditor") {
          this.isEditor = true;
          let initStudio = () => {
            this.studioBridge = new window.WeaverseStudioBridge(this);
            this.studioBridge.subscribeMessageEvent();
            this.triggerUpdate();
          };

          if (!window.WeaverseStudioBridge) {
            // load studio bridge script by url: https://weaverse.io/assets/studio/studio-bridge.js
            const studioBridgeScript = document.createElement("script");
            studioBridgeScript.src = `${this.appUrl}/assets/studio/studio-bridge.js`;
            studioBridgeScript.type = "module";
            studioBridgeScript.onload = initStudio;
            document.body.appendChild(studioBridgeScript);
          } else {
            initStudio();
          }
        }
      });
    }
  }

  subscribe(fn: any) {
    this.listeners.add(fn);
  }

  unsubscribe(fn: any) {
    this.listeners.delete(fn);
  }

  triggerUpdate() {
    this.listeners.forEach((fn) => fn());
    if (this.isEditor && this.studioBridge) {
      this.studioBridge.sendMessageToEditor("weaverse.editor.updateProject", {
        projectData: this.projectData,
        projectKey: this.projectKey,
        appUrl: this.appUrl,
      });
    }
  }

  /**
   * fetch data from Weaverse API (https://weaverse.io/api/v1/projects/:projectKey)
   * @param fetch {fetch} custom fetch function, pass in custom fetch function if you want to use your own fetch function
   */
  fetchProjectData(fetch = globalThis.fetch) {
    return fetch(this.appUrl + `/api/public/${this.projectKey}`)
      .then((r) => r.json())
      .catch(console.error);
  }

  /**
   * fetch and update the project data, then trigger update to re-render the WeaverseRoot
   */
  updateProjectData() {
    if (this.projectKey) {
      this.fetchProjectData()
        .then((data) => {
          if (data) {
            this.projectData = data;
            this.initProjectItemData();
            this.triggerUpdate();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  initProjectItemData() {
    let data = this.projectData;
    if (data.items) {
      data.items.forEach((item) => {
        if (!this.itemInstances.get(item.id)) {
          new WeaverseItemStore(item, this);
        }
      });
    }
  }
}

export * from "./types";
