export type TODO = any;
export type WeaverseElementMap = {
  [key: string]: WeaverseElement;
};

export type WeaverseElement = {
  Component: TODO;
  schema: WeaverseElementSchema;
};

export type WeaverseElementSchema = {
  title: string;
  type: string;
  settings: WeaverseElementSetting[];
  toolbar: TODO;
  data?: TODO; // Default Element data
};

export type WeaverseElementSetting = {
  tab: string;
  label: string;
  inspectors: WeaverseElementInspector[];
};

export type WeaverseElementInspector = {
  binding: "data" | "style";
  key?: string;
  label?: string;
  type?: InspectorInputType;
  options?: InspectorOption[];
  default?: TODO;
};

export type InspectorOption = {
  value: TODO;
  label: string;
};

export type InspectorInputType = "alignment" | "color" | "switch" | "spacing" | "textarea" | "select";
declare global {
  interface Window {
    WeaverseStudioBridge: TODO;
  }
}
