/**
 * Fetch data from Weaverse API (https://weaverse.io/api/v1/project/:projectId)
 * @param fetch {fetch} custom fetch function, pass in custom fetch function if you want to use your own fetch function
 * @param weaverseHost
 * @param projectId
 * @param isDesignMode
 */
export async function fetchProjectData({
  fetch = globalThis.fetch,
  weaverseHost,
  projectId,
  isDesignMode,
  timestamp,
}: {
  fetch?: any
  weaverseHost?: string
  projectId?: string
  isDesignMode?: boolean
  timestamp?: number
}) {
  let data
  if (timestamp && !isDesignMode) {
    data = localStorage.getItem(`weaverse-${projectId}-${timestamp}`)
    if (data) {
      return JSON.parse(data)
    }
  }

  let params = new URLSearchParams()

  timestamp && params.append('timestamp', timestamp.toString())
  isDesignMode && params.append('isDesignMode', 'true')

  let paramString = params.toString()

  data = await fetch(
    weaverseHost +
      `/api/public/project/${projectId}${paramString ? '?' + paramString : ''}`
  )
    .then((res: Response) => res.json())
    .catch((err: Error) => console.log('Error fetching project data:', err))
  if (data) {
    if (timestamp && !isDesignMode) {
      localStorage.setItem(
        `weaverse-${projectId}-${timestamp}`,
        JSON.stringify(data)
      )
    }
    return data
  }
  return null
}
