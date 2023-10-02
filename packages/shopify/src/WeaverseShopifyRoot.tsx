import { WeaverseRoot } from '@weaverse/react'
import React from 'react'
import { useStudio } from './hooks/use-studio'
import { WeaverseShopify } from './index'
import type { WeaverseShopifyParams } from './types/weaverse-shopify'

export function createWeaverseShopify(params: WeaverseShopifyParams) {
  let weaverse = new WeaverseShopify(params)
  return weaverse
}

export function ShopifyRoot({ context }: { context: WeaverseShopify }) {
  useStudio(context)
  return <WeaverseRoot context={context} />
}
