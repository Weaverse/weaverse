import { WeaverseRoot } from '@weaverse/react'
import React from 'react'
import { createWeaverseInstance } from './context'
import { useStudio } from './hooks/use-studio'
import type { WeaverseHydrogenRootProps } from './types'
export * from './hooks/use-theme-setting'
export * from './fetch'
export * from './loader'
export * from './types'
export * from '@weaverse/react'

export function WeaverseHydrogenRoot(props: WeaverseHydrogenRootProps) {
  let { components, weaverseData, themeSchema, navigate } = props
  let weaverse = createWeaverseInstance(weaverseData, components)
  useStudio(weaverse, themeSchema, navigate)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
