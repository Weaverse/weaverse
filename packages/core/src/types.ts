export type InspectorComponentType = "textarea" | "color"

export type WeaverseElementInspector = {
  binding: 'data' | 'style',
  key: string,
  componentType: InspectorComponentType,
}

export type WeaverseElementSetting = {
  tab: string
  label: string
  inspectors: WeaverseElementInspector[]
}

export type WeaverseElement = {
  Component: any
  schema: {
    title: string
    type: string
    settings: WeaverseElementSetting[]
  }
}
export type WeaverseElementMap = {
  [key: string]: WeaverseElement
}

declare global {
  interface Window {
    WeaverseStudioBridge: any
  }
}