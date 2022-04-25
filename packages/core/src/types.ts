export type TODO = any;
export type WeaverseElementMap = {
  [key: string]: WeaverseElement;
};

export type WeaverseElement = {
  Component: TODO;
  schema: WeaverseElementSchema;
};

export type WeaverseElementSchema = {
  title?: string;
  type: string;
  settings?: WeaverseElementSettingInput[];
  styles?: WeaverseElementStyleInput[];
  toolbar?: TODO;
  data?: TODO; // Default Element data
};
export type WeaverseElementStyleInput = {
  name?: string;
  type: 'alignment' | 'color' | 'dimensions' | 'flex' | 'grid' | 'input' | 'switch' | 'spacing' | 'textarea' | 'visibility' | 'border' | 'background' | 'typography' | 'shadow' | 'position' | 'overflow' | 'display' | 'other';
  defaultValue?: string;
};
export type WeaverseElementSettingInput = {
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'color' | 'range' | 'button' | 'image';
  name: string;
  defaultValue?: string;
  helpText?: string;
  options?: TODO[];
  condition?: TODO;
};
declare global {
  interface Window {
    WeaverseStudioBridge: TODO;
  }
}
