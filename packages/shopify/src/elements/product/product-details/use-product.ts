import { WeaverseContext } from '@weaverse/react'
import { useContext, useEffect, useRef, useState } from 'react'

import { weaverseShopifyProducts } from '~/proxy'
import type { ShopifyProduct, ShopifyProductVariant } from '~/types/shopify'

export function useProduct(
  productId: number | 'default',
  useDefaultProduct: boolean,
) {
  let { isDesignMode } = useContext(WeaverseContext)
  let [ready, setReady] = useState(false)
  let formRef = useRef<HTMLFormElement>(null)

  let product: ShopifyProduct = weaverseShopifyProducts[productId]
  if (useDefaultProduct && !isDesignMode) {
    let defaultProduct = weaverseShopifyProducts['default']
    if (defaultProduct?.id) {
      product = defaultProduct
    }
  }

  let [selectedVariant, setSelectedVariant] =
    useState<ShopifyProductVariant | null>(null)

  useEffect(() => {
    if (product) {
      setSelectedVariant(
        product.selected_or_first_available_variant || product.variants[0],
      )
      window.weaverseCartHelpers?.notify('on_product_rendered', {
        product,
        formRef,
      })
      setReady(true)
    }
  }, [product])

  return {
    product,
    ready,
    formRef,
    selectedVariant,
    setSelectedVariant,
  }
}
