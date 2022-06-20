import { CSSProperties } from "@stitches/core";

export interface ProjectDataType {
  items: WeaverseElementData[];
  rootId: string | number;
  script: {
    css: string;
    js: string;
  }
}

export type WeaverseType = {
  mediaBreakPoints?: any
  appUrl?: string;
  projectKey?: string;
  projectData?: ProjectDataType;
  isDesignMode?: boolean;
  ssrMode?: boolean;
};

export type TODO = any;
export type WeaverseElementMap = {
  [key: string]: WeaverseElement;
};

export type WeaverseElement = {
  Component: TODO;
  schema: WeaverseElementSchema;
};

export type WeaverseElementCatalog = {
  name: string
  icon?: string
  group?: 'essential' | 'composition' | 'other'
}

export type ElementFlags = 'draggable' | 'resizable' | 'sortable' | 'hasSelection'

export type WeaverseElementFlags = {
  [key in ElementFlags]?: boolean
}

export type WeaverseElementSchema = {
  title?: string;
  type: string;
  parentType: "container" | "layout" | "root";
  settings?: WeaverseElementInput[];
  styles?: WeaverseElementInput[];
  toolbar?: TODO;
  data?: WeaverseElementData; // Default Element data
  catalog?: WeaverseElementCatalog; // Element catalog
  flags?: WeaverseElementFlags
};
export type WeaverseElementData = {
  id?: string | number
  type?: string | undefined
  childIds?: (string | number)[] | undefined
  css?: WeaverseElementCSS
  [key: string]: any;
}
export type WeaverseElementCSS = {
  '@desktop'?: CSSProperties | { [key: string]: CSSProperties }
  '@mobile'?: CSSProperties | { [key: string]: CSSProperties }
}
export type WeaverseElementInput = {
  label?: string;
  type: 'select' | 'checkbox' | 'radio' | 'range' | 'button' | 'image' | 'file' | 'hidden' | 'alignment' | 'color' | 'dimensions' | 'flex' | 'grid' | 'input' | 'switch' | 'spacing' | 'textarea' | 'visibility' | 'border' | 'background' | 'typography' | 'shadow' | 'position' | 'overflow' | 'display' | 'other'
  name?: string; // binding property name
  defaultValue?: string;
  helpText?: string; // display help text
  options?: TODO[]; // select options
  conditions?: TODO[]; // only display if conditions are met, eg. {  name: 'productDataLoaded', value: true }
  [key: string]: TODO; // other properties, implement later
};
declare global {
  interface Window {
    WeaverseStudioBridge: TODO;
    weaverseShopifyProducts: TODO;
  }
}
