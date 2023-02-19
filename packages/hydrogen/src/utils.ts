export type WHFetchConfigs = {
  studioUrl?: string
  projectKey: string
  url: URL
}
export let fetchPageData = async ({
  studioUrl = 'https://studio.weaverse.io',
  projectKey,
  url,
}: WHFetchConfigs) => {
  let handle = url.pathname
  let isDesignMode = url.searchParams.get('isDesignMode') === 'true'

  let data = await fetch(studioUrl + '/api/public/project', {
    method: 'POST',
    body: JSON.stringify({
      projectKey,
      handle,
      published: !isDesignMode,
    }),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return {}
    })
  return { ...data, studioUrl, isDesignMode }
}
