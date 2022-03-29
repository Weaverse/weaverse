export type WeaverseElementMap = {
  [key: string]: WeaverseElement
}

export type WeaverseElement = {
  Component: any
  schema: WeaverseElementSchema
}

export type WeaverseElementSchema = {
  title: string
  type: string
  settings: WeaverseElementSetting[]
}

export type WeaverseElementSetting = {
  tab: string
  label: string
  inspectors: WeaverseElementInspector[]
}

export type WeaverseElementInspector = {
  binding: 'data' | 'style',
  key: string,
  type: InspectorInputType,
}

export type InspectorInputType = "textarea" | "color" | "alignment"
declare global {
  interface Window {
    WeaverseStudioBridge: any
  }
}