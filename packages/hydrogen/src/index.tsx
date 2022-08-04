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

let fetchPageData = ({
  baseUrl = 'https://studio.weaverse.io',
  projectKey,
  handle,
  published = true,
}: {
  baseUrl?: string
  projectKey: string
  handle: string
  published?: boolean
}) => {
  return fetch(baseUrl + '/api/public/projects', {
    method: 'POST',
    body: JSON.stringify({
      projectKey,
      handle,
      published,
    }),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return {}
    })
}

export { WeaverseHydrogenRoot, createWeaverseHydrogenContext, fetchPageData }
