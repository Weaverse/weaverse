import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext, weaverseShopifyStoreData } from '../context'

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

let ProductPrice = forwardRef<HTMLDivElement>((props, ref) => {
  let { ...rest } = props
  let { product, variantId } = useContext(ProductContext)
  let { ssrMode } = useContext(WeaverseContext)
  if (ssrMode) {
    return (
      <div ref={ref} {...rest}>
        {`{{ wv_product.price | money_without_trailing_zeros }}`}
      </div>
    )
  }
  let variants = product.variants || []
  let variantIndex = Math.max(
    variants.findIndex((variant) => variant.id === variantId),
    0
  )
  let price = product.variants[variantIndex]?.price

  return (
    <div ref={ref} {...rest}>
      {formatCurrency(price)}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    fontWeight: 600,
  },
}

ProductPrice.defaultProps = {}

export default ProductPrice
