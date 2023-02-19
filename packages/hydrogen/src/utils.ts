export type WHFetchConfigs = {
  weaverseHost?: string
  projectId: string
  url: URL
}
export let fetchPageData = async ({
  weaverseHost = 'https://studio.weaverse.io',
  projectId,
  url,
}: WHFetchConfigs) => {
  let handle = url.pathname
  let isDesignMode = url.searchParams.get('isDesignMode') === 'true'

  let data = await fetch(weaverseHost + '/api/public/project', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      handle,
      isDesignMode,
    }),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return {}
    })
  return { ...data, weaverseHost, isDesignMode }
}
