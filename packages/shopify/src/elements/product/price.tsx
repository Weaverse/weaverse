import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext, weaverseShopifyStoreData } from './context'

function formatCurrency(price: string | undefined) {
  if (typeof price === 'undefined') return price
  if (typeof price === 'number') {
    price = Number(price / 100).toFixed(0)
  }
  let { money_format, primary_locale } = weaverseShopifyStoreData

  let formatPrice = new Intl.NumberFormat(primary_locale).format(Number(price))
  return money_format
    ? money_format.replace(/{{[^}]*}}/, price)
    : `$${formatPrice}`
}

let ProductPrice = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId, variantId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  if (!productId) {
    return null
  }
  let variants = product?.variants || []
  let variantIndex = Math.max(
    variants.findIndex((variant) => variant.id === variantId),
    0
  )
  let price = product?.variants[variantIndex]?.price

  return (
    <div ref={ref} {...rest}>
      {ssrMode
        ? `{{ product_${productId}.price | money_without_trailing_zeros }}`
        : formatCurrency(price)}
    </div>
  )
})

ProductPrice.defaultProps = {
  css: {
    '@desktop': {
      fontWeight: 600,
    },
  },
}

export default ProductPrice
