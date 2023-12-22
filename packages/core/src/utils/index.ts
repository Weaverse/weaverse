export let isReactNative = typeof navigator === 'object' && navigator.product === 'ReactNative'
export let isBrowser = typeof window !== 'undefined' && !isReactNative
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

export function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    let currScript = document.querySelector(`script[src="${src}"]`)
    if (currScript) {
      return resolve(true)
    }
    let script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    script.defer = true
    document.body.appendChild(script)
  })
}
