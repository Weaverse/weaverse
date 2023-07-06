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

export function WeaverseHydrogenRoot(props: WeaverseHydrogenRootProps) {
  console.log('💿 WeaverseHydrogenRoot props', props)
  let { components, data, themeSchema } = props
  let weaverse = createWeaverseHydrogenContext(data, components)
  useStudio(weaverse, themeSchema)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
