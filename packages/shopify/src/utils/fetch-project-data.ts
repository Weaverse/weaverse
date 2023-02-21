/**
 * Fetch data from Weaverse API (https://weaverse.io/api/v1/project/:projectId)
 * @param fetch {fetch} custom fetch function, pass in custom fetch function if you want to use your own fetch function
 * @param weaverseHost
 * @param projectId
 * @param isDesignMode
 */
export function fetchProjectData({
  fetch = globalThis.fetch,
  weaverseHost,
  projectId,
  isDesignMode,
}: {
  fetch?: any
  weaverseHost?: string
  projectId?: string
  isDesignMode?: boolean
}) {
  return fetch(
    weaverseHost +
      `/api/public/project/${projectId}${
        isDesignMode ? `?isDesignMode=true` : ''
      }`
  )
    .then((res: Response) => res.json())
    .catch((err: Error) => console.log('Error fetching project data:', err))
}
