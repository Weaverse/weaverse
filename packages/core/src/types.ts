export type WeaverseElement = {
  Component: any
  schema: {
    type: string
    [key: string]: any
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