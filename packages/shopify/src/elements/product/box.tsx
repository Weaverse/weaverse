import React, { forwardRef, useId, useState } from 'react'
import { ProductProvider, weaverseShopifyProducts } from './context'
import type { ProductBoxProps } from '~/types'

let ProductBox = forwardRef<HTMLDivElement, ProductBoxProps>((props, ref) => {
  let { children, productId, productHandle, optionStyles, ...rest } = props
  let product = weaverseShopifyProducts[productId]
  let formId = useId()

  let [variantId, onChangeVariant] = useState(product?.variants[0].id || '')
  return (
    <div {...rest} ref={ref}>
      {productId ? (
        <ProductProvider
          value={{ product, productId, formId, variantId, onChangeVariant }}
        >
          {children}
        </ProductProvider>
      ) : (
        'Select a product and start editing.'
      )}
    </div>
  )
})

ProductBox.defaultProps = {
  productId: 7176137277624,
  productHandle: 'adidas-kids-stan-smith',
  css: {
    '@desktop': {},
  },
}

export default ProductBox
