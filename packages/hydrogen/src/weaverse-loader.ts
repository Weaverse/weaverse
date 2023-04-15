import type { LoaderArgs } from '@remix-run/server-runtime'
export async function weaverseLoader({
  request,
  context,
  params,
}: LoaderArgs): Promise<any> {
  /**
   * @todo read the url and params from the request => JSON DATA (items, installed add-ons)
   * @todo load the weaverse project page data by current url and projectId
   * @todo read the page data to detech whether items data need 3rd party api call (shopify data, etc)
   * @todo with data from Shopify, we can get it by using context.storefront.query(graphqlQuery)
   * @todo if items data need 3rd party api call, call the api and return the data
   * @todo the returned data format will be {weaversePageData: {}, 3rdPartyData: {}, products: [], collections: [], product: {}, collection: {}, etc}
   */
  return {
    foo: 'bar',
  }
}
