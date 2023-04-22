import type { LoaderArgs } from '@remix-run/server-runtime'
export async function weaverseLoader({
  request,
  context,
  params,
}: LoaderArgs): Promise<any> {
  let env = context?.env as {
    WEAVERSE_PROJECT_ID?: string
    WEAVERSE_HOST?: string
  }

  let projectId = env?.WEAVERSE_PROJECT_ID
  let weaverseHost = env?.WEAVERSE_HOST
  if (!projectId || !weaverseHost) {
    console.error('WEAVERSE_PROJECT_ID or WEAVERSE_HOST is not set!')
    return {}
  }
  let fetchBody = {
    projectId,
    url: request.url,
  }
  try {
    /**
     * @todo read the url and params from the request => JSON DATA (items, installed add-ons)
     * @todo load the weaverse project page data by current url and projectId
     * @todo read the page data to detech whether items data need 3rd party api call (shopify data, etc)
     * @todo with data from Shopify, we can get it by using context.storefront.query(graphqlQuery)
     * @todo if items data need 3rd party api call, call the api and return the data
     * @todo the returned data format will be {weaversePageData: {}, 3rdPartyData: {}, products: [], collections: [], product: {}, collection: {}, etc}
     */
    let response = await fetch(`${weaverseHost}/api/public/project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fetchBody),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err)
        return {}
      })
    return {
      weaversePageData: response,
      weaverseConfig: {
        projectId,
        weaverseHost,
      },
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}
