export let isReactNative =
  typeof navigator === 'object' && navigator.product === 'ReactNative'
export let isBrowser = typeof window !== 'undefined' && !isReactNative
export let isIframe = isBrowser && window.top !== window.self

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function merge(
  target: Record<string, any>,
  source: Record<string, any>
) {
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

// Cache in-flight/settled loads per src. A bare `querySelector` check is not
// enough: the tag exists as soon as the first caller appends it, so a second
// caller arriving before the script *executes* would resolve early and read
// globals (e.g. `window.weaverseStudio`) that aren't set yet. See issue #451.
let scriptLoadPromises = new Map<string, Promise<unknown>>()
export function loadScript(src: string) {
  let pending = scriptLoadPromises.get(src)
  if (pending) {
    return pending
  }
  let promise = new Promise((resolve, reject) => {
    let currScript = document.querySelector(`script[src="${src}"]`)
    if (currScript) {
      // Tag injected outside loadScript (e.g. SSR markup) — assume executed.
      return resolve(true)
    }
    let script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = (error) => {
      // Drop the cache entry and the broken tag so a later call can retry.
      scriptLoadPromises.delete(src)
      script.remove()
      reject(error)
    }
    script.defer = true
    document.body.appendChild(script)
  })
  scriptLoadPromises.set(src, promise)
  return promise
}
