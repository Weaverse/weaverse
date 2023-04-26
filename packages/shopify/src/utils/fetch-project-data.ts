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
  let params = new URLSearchParams()

  timestamp && params.append('timestamp', timestamp.toString())
  isDesignMode && params.append('isDesignMode', 'true')
  let paramString = params.toString()

  if (timestamp && !isDesignMode) {
    return fetchWithCache.fetchJson(
      weaverseHost +
        `/api/public/project/${projectId}${
          paramString ? '?' + paramString : ''
        }`,
      timestamp.toString()
    )
  }

  return await fetch(
    weaverseHost +
      `/api/public/project/${projectId}${paramString ? '?' + paramString : ''}`
  )
    .then((res: Response) => res.json())
    .catch((err: Error) => {
      console.error('Error fetching project data:', err)
      return null
    })
}
class FetchWithCache {
  private generateCacheKey(url: string, nonce: string): string {
    return `${url}_${nonce}`
  }

  public async fetchJson(url: string, nonce = ''): Promise<any> {
    const cacheKey = this.generateCacheKey(url, nonce)
    const cacheEntry = sessionStorage.getItem(cacheKey)

    if (cacheEntry) {
      return JSON.parse(cacheEntry)
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`)
    }

    const data = await response.json()
    sessionStorage.setItem(cacheKey, JSON.stringify(data))

    return data
  }
}

const fetchWithCache = new FetchWithCache()
