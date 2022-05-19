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

export type WeaverseElementSchema = {
  title?: string;
  type: string;
  settings?: WeaverseElementInput[];
  styles?: WeaverseElementInput[];
  toolbar?: TODO;
  data?: TODO; // Default Element data
  catalog?: WeaverseElementCatalog; // Element catalog
};
export type WeaverseElementInput = {
  label?: string;
  type:  'select' | 'checkbox' | 'radio'  | 'range' | 'button' | 'image' | 'file' | 'hidden'  | 'alignment' | 'color' | 'dimensions' | 'flex' | 'grid' | 'input' | 'switch' | 'spacing' | 'textarea' | 'visibility' | 'border' | 'background' | 'typography' | 'shadow' | 'position' | 'overflow' | 'display' | 'other'
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
