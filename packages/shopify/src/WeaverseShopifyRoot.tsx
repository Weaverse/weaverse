import { WeaverseRoot } from '@weaverse/react'
import React from 'react'

import { useStudio } from './hooks/use-studio'
import type { WeaverseShopifyParams } from '~/types'

import { registerShopifyElements, WeaverseShopify } from './index'

export function createWeaverseShopify(params: WeaverseShopifyParams) {
  registerShopifyElements()
  return new WeaverseShopify(params)
}

export function ShopifyRoot({ context }: { context: WeaverseShopify }) {
  useStudio(context)
  return <WeaverseRoot context={context} />
}
