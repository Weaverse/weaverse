import elements from './elements'
import type { WeaverseRootPropsType, WeaverseType } from '@weaverse/react'
import { createRootContext, WeaverseRoot } from '@weaverse/react'
import React from 'react'

export * from '@weaverse/react'

export type WeaverseRootProps = WeaverseRootPropsType & {
  data?: any
}

let createWeaverseHydrogenContext = (configs: WeaverseType) => {
  let context = createRootContext(configs)

  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
  return context
}

let WeaverseHydrogenRoot = ({ context }: WeaverseRootProps) => {
  return context?.projectData?.items ? <WeaverseRoot context={context} /> : null
}
export type WHFetchConfigs = {
  studioUrl?: string
  projectKey: string
  url: URL
}
let fetchPageData = async ({
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
  return { ...data, studioUrl }
}

export { WeaverseHydrogenRoot, createWeaverseHydrogenContext, fetchPageData }
