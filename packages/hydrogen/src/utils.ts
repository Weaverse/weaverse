import type { Weaverse } from '@weaverse/core'
import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'

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

// TODO: make @weaverse/react framework agnostic and then move this code to @weaverse/react
export let useStudio = (weaverseCore: Weaverse) => {
  useEffect(() => {
    if (
      weaverseCore.isDesignMode &&
      isIframe &&
      !window.weaverseStudioInitialized
    ) {
      loadScript(
        `${
          weaverseCore.weaverseHost
        }/assets/studio/studio-bridge.js?t=${Date.now()}`
      ).then(() => {
        // @ts-ignore
        window?.createWeaverseStudioBridge(weaverseCore)
        setTimeout(() => {
          weaverseCore.triggerUpdate()
        }, 2000)
      })
    }
  }, [])
}
