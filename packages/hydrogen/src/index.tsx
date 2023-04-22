import type { WeaverseElement, WeaverseType } from '@weaverse/core'
import { Weaverse } from '@weaverse/core'
import { useStudio } from './utils'
import React from 'react'
import type { WeaverseHydrogenConfigs } from './types'
import { WeaverseRoot } from '@weaverse/react'
import { createWeaverseHydrogenContext } from './context'
export * from './utils'
export * from './weaverse-loader'
export let WeaverseHydrogenRoot = ({
  configs,
  data,
}: {
  configs: WeaverseHydrogenConfigs
  data: any
}) => {
  let weaverse = createWeaverseHydrogenContext(configs, data)
  useStudio(weaverse)
  if (!weaverse?.data) {
    return <div>404</div>
  }
  return <WeaverseRoot context={weaverse} />
}
