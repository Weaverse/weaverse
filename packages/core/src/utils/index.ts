export let isReactNative = typeof navigator === "object" && navigator.product === "ReactNative"
export let isBrowser = typeof window !== "undefined" && !isReactNative
export let isIframe = isBrowser && window.top !== window.self

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function merge(target: Record<string, any>, source: Record<string, any>) {
  let t = { ...(target || {}) }
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (let key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], merge(t[key], source[key]))
    }
  }

  // Join `target` and modified `source`
  Object.assign(t || {}, source)
  return t
}
