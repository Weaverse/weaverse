/**
 * For quick access to shopify data and server-side render,
 * create a proxy version of each object
 */
function createProxy(obj: string) {
  // @ts-ignore
  return new Proxy(globalThis?.[obj] || {}, {
    get(target, prop) {
      // @ts-ignore
      return target?.[prop] || globalThis?.[obj]?.[prop]
    },
  })
}

export let weaverseShopifyConfigs = createProxy('weaverseShopifyConfigs')

export let weaverseShopifyProducts = createProxy('weaverseShopifyProducts')
export let weaverseShopifyProductsByCollection = createProxy(
  'weaverseShopifyProductsByCollection',
)
export let weaverseShopifyCollections = createProxy(
  'weaverseShopifyCollections',
)
export let weaverseShopifyArticlesByBlog = createProxy(
  'weaverseShopifyArticlesByBlog',
)
export let weaverseShopifyArticles = createProxy('weaverseShopifyArticles')
