export * from "./styles"

export const isReactNative = typeof navigator === "object" && navigator.product === "ReactNative"
export const isBrowser = typeof window !== "undefined" && !isReactNative
export const isIframe = isBrowser && window.top !== window.self

export function merge(target: Record<string, any>, source: Record<string, any>) {
  for (let key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
  }
  Object.assign(target || {}, source)
  return target
}
