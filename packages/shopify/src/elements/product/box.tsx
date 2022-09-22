import React, { forwardRef, useContext, useId, useState } from 'react'
import {
  ProductListContext,
  ProductProvider,
  weaverseShopifyProducts,
} from './context'
import type { ProductBoxProps } from '~/types'

let ProductBox = forwardRef<HTMLDivElement, ProductBoxProps>((props, ref) => {
  let { children, productId: pId, productHandle, optionStyles, ...rest } = props
  let { productId: productAutoId } = useContext(ProductListContext)
  let productId = productAutoId || pId
  let product = weaverseShopifyProducts[productId]
  let formId = useId()
  let [variantId, onChangeVariant] = useState(product?.variants[0].id || '')
  return (
    <div {...rest} ref={ref}>
      {productId ? (
        <ProductProvider
          value={{
            product,
            productId,
            formId,
            variantId,
            onChangeVariant,
          }}
        >
          {product && children}
        </ProductProvider>
      ) : (
        'Select a product and start editing.'
      )}
    </div>
  )
})

ProductBox.defaultProps = {
  // productId: 7176137277624,
  // productHandle: 'adidas-kids-stan-smith',
}

export default ProductBox
