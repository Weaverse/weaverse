import { WeaverseRoot } from '@weaverse/react'
import React from 'react'
import { WeaverseShopify } from '.'
import { useStudio } from './hooks/use-studio'
import type { WeaverseShopifyParams } from './types/weaverse-shopify'

export function createWeaverseShopify(params: WeaverseShopifyParams) {
  let weaverse = new WeaverseShopify(params)
  return weaverse
}

export function ShopifyRoot({ context }: { context: WeaverseShopify }) {
  useStudio(context)
  return <WeaverseRoot context={context} />
}
