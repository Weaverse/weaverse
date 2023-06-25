import { WeaverseRoot } from '@weaverse/react'
import React from 'react'
import { createWeaverseHydrogenContext } from './context'
import { useStudio } from './hooks/use-studio'
import type { WeaverseHydrogenRootProps } from './types'
export * from './hooks/use-theme-setting'
export * from './fetch'
export * from './loader'
export * from './types'
export * from '@weaverse/react'

export let WeaverseHydrogenRoot = (props: WeaverseHydrogenRootProps) => {
  let { components, data, themeSchema } = props
  console.log('WeaverseHydrogenRoot', props)

  let weaverse = createWeaverseHydrogenContext(data, components)
  useStudio(weaverse, themeSchema)

  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
