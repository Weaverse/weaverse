import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext, weaverseShopifyStoreData } from './context'

function formatCurrency(price: string | undefined) {
  if (typeof price !== 'string') return price
  let { money_format, primary_locale } = weaverseShopifyStoreData
  let formatPrice = new Intl.NumberFormat(primary_locale).format(Number(price))
  return money_format
    ? money_format.replace(/{{[^}]*}}/, price)
    : `$${formatPrice}`
}

let ProductPrice = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  if (!productId) {
    return null
  }
  let price = product?.variants[0].price
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
    '@desktop': {},
  },
}

export default ProductPrice
