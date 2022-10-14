/**
 * For quick access to shopify data and server-side render,
 * create a proxy version of each object
 */
function createProxy(obj: any) {
  // @ts-ignore
  return new Proxy(globalThis?.[obj] || {}, {
    get(target, prop) {
      // @ts-ignore
      return target?.[prop] || globalThis?.[obj]?.[prop]
    },
  })
}

export let weaverseShopifyStoreData = createProxy('weaverseShopifyStoreData')
export let weaverseSwatchesSettings = createProxy('weaverseSwatchesSettings')
export let weaversePresetsSettings = createProxy('weaversePresetsSettings')

export let weaverseShopifyProducts = createProxy('weaverseShopifyProducts')
export let weaverseShopifyCollections = createProxy(
  'weaverseShopifyCollections'
)
export let weaverseShopifyProductLists = createProxy(
  'weaverseShopifyProductLists'
)
export let weaverseShopifyArticles = createProxy('weaverseShopifyArticles')
export let weaverseShopifyBlogs = createProxy('weaverseShopifyBlogs')
