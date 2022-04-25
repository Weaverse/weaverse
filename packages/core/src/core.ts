// TODO: Implement Weaverse SDK class
// Only core code is implemented here, avoid importing other packages,
// the core code should be framework agnostic, no react, vue, angular, etc.
import type { TODO, WeaverseElement } from "./types";
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
  isDesignMode?: boolean;
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
  listeners: Set<any> = new Set();
  ref: any = {
    current: null,
  };
  weaverse: Weaverse;

  constructor(itemData: any = {}, weaverse: Weaverse) {
    let { type, id } = itemData;
    this.weaverse = weaverse;

    if (id && type) {
      weaverse.itemInstances.set(id, this);
      this.data = { ...itemData };
    }
  }

  _data: any = {};

  get Element() {
    return this.weaverse.elementInstances.get(this._data.type) as WeaverseElement;
  }

  set data(data: any) {
    this._data = { ...this.data, ...data };
  }

  get data() {
    return { ...this.Element?.Component?.defaultProps, ...this.Element?.schema?.data, ...this._data };
  }

  setData = (data: any) => {
    this.data = Object.assign(this.data, data);
    this.triggerUpdate();
    return this.data;
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
   * check whether the sdk is isDesignMode or not
   * if isDesignMode is true, it means the sdk is isDesignMode mode, render the editor UI
   * else render the preview UI, plain HTML + CSS + React hydrate
   * @type {boolean}
   */
  isDesignMode: boolean = false;
  /**
   * stitches instance for handling CSS stylesheet, media, theme for Weaverse project
   */
  stitchesInstance: Stitches | any;

  studioBridge?: any;
  static WeaverseItemStore: typeof WeaverseItemStore = WeaverseItemStore;

  mediaBreakPoints = {
    desktop: "all",
    // max-width need to subtract 0.02px to prevent bug https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    // tablet: "(max-width: 1023.98px)", // to set css for tablet, {'@tablet' : { // css }},
    mobile: "(max-width: 767.98px)",
  };

  /**
   * constructor
   * @param appUrl {string} Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @param projectKey {string} Weaverse project key to access project data via API
   * @param projectData {ProjectDataType} Weaverse project data, by default, user can provide project data via React Component.
   * @param mediaBreakPoints {object} Pass down custom media query breakpoints or just use the default.
   */
  constructor({ appUrl, projectKey, projectData, mediaBreakPoints, isDesignMode }: WeaverseType = {}) {
    this.appUrl = appUrl || this.appUrl;
    this.projectKey = projectKey || this.projectKey;
    this.mediaBreakPoints = mediaBreakPoints || this.mediaBreakPoints;
    this.isDesignMode = isDesignMode || this.isDesignMode;
    projectData && (this.projectData = projectData);
    this.init();
  }

  /**
   * register the custom React Component to Weaverse, store it into Weaverse.elementInstances
   * @param element {WeaverseElement} custom React Component
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
    this.initProjectItemData();
    this.updateProjectData()
  }

  initStitches = () => {
    // init the stitches instance
    this.stitchesInstance = stitches.createStitches({
      prefix: "weaverse",
      media: this.mediaBreakPoints,
      theme: {
        sizes: {
          "width": "100%",
          "max-width": "100%",
          "column-count": "16",
          "row-count": "12",
          "row-size": "48px",
        },
        space: {
          gap: "8px",
        },
      },
    });
  };
  loadStudio() {
    if (this.isDesignMode && isIframe) {
      let initStudio = () => {
        this.studioBridge = new window.WeaverseStudioBridge(this);
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
  }

  subscribe(fn: any) {
    this.listeners.add(fn);
  }

  unsubscribe(fn: any) {
    this.listeners.delete(fn);
  }

  triggerUpdate() {
    this.listeners.forEach((fn) => fn());
  }

  /**
   * fetch data from Weaverse API (https://weaverse.io/api/v1/projects/:projectKey)
   * @param fetch {fetch} custom fetch function, pass in custom fetch function if you want to use your own fetch function
   * @param appUrl
   * @param projectKey
   */
  static fetchProjectData({
    fetch = globalThis.fetch,
    appUrl,
    projectKey,
  }: {
    fetch?: any;
    appUrl?: string;
    projectKey?: string;
  }) {
    return fetch(appUrl + `/api/public/${projectKey}`)
      .then((r: TODO) => r.json())
      .catch(console.error);
  }

  /**
   * fetch and update the project data, then trigger update to re-render the WeaverseRoot
   */
  updateProjectData() {
    if (this.projectKey && !this.projectData.rootId) {
      Weaverse.fetchProjectData({ appUrl: this.appUrl, projectKey: this.projectKey })
        .then((data: ProjectDataType) => {
          if (data) {
            this.projectData = data;
            this.initProjectItemData();
            this.triggerUpdate();
          }
        })
        .catch((err: TODO) => {
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
