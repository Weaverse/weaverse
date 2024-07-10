import { WeaverseRoot } from '@weaverse/react'
import React from 'react'

import type { WeaverseShopifyParams } from '~/types'
import { useStudio } from './hooks/use-studio'

import { WeaverseShopify, registerShopifyElements } from './index'

export function createWeaverseShopify(params: WeaverseShopifyParams) {
  registerShopifyElements()
  return new WeaverseShopify(params)
}

export function ShopifyRoot({ context }: { context: WeaverseShopify }) {
  useStudio(context)
  return <WeaverseRoot context={context} />
}
