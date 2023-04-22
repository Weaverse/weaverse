import type { WeaverseElement, WeaverseType } from '@weaverse/core'
import { Weaverse } from '@weaverse/core'
import { useStudio } from './utils'
import React from 'react'
import type { WeaverseComponentsType } from './types'
import { WeaverseRoot } from '@weaverse/react'
import { createWeaverseHydrogenContext } from './context'
export * from './utils'
export * from './weaverse-loader'
export let WeaverseHydrogenRoot = ({
  components,
  data,
}: {
  components: WeaverseComponentsType
  data: any
}) => {
  let weaverse = createWeaverseHydrogenContext(data, components)
  useStudio(weaverse)
  if (!weaverse?.data) {
    return <div>404</div>
  }
  return <WeaverseRoot context={weaverse} />
}
