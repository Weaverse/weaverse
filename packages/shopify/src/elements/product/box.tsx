import React, { forwardRef, useContext, useId, useState } from 'react'
import {
  ProductContext,
  ProductListContext,
  weaverseShopifyProducts,
} from '../context'
import type { ProductBoxProps } from '~/types'
import { WeaverseContext } from '@weaverse/react'

let ProductBox = forwardRef<HTMLDivElement, ProductBoxProps>((props, ref) => {
  let { children, productId: pId, productHandle, optionStyles, ...rest } = props
  let { ssrMode } = useContext(WeaverseContext)
  let { productId: productAutoId } = useContext(ProductListContext)
  let productId = productAutoId || pId
  let product = weaverseShopifyProducts[productId]
  let formId = useId()
  let [variantId, onChangeVariant] = useState(product?.variants[0].id || '')
  if (ssrMode) {
    return (
      <div {...rest} ref={ref}>
        {` {% unless wv_product %}
          {% assign wv_product = product_${productId} %}
        {% endunless %}
        `}
        {children}
      </div>
    )
  }
  return (
    <div {...rest} ref={ref}>
      {productId ? (
        <ProductContext.Provider
          value={{
            product,
            productId,
            formId,
            variantId,
            onChangeVariant,
          }}
        >
          {product && children}
        </ProductContext.Provider>
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
