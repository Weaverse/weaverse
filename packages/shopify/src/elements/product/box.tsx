import React, { forwardRef } from 'react'
import { ProductProvider, weaverseShopifyProducts } from './context'
import { ProductBoxProps } from '../../type'

let ProductBox = forwardRef<HTMLDivElement, ProductBoxProps>((props, ref) => {
  let { children, productId, ...rest } = props
  let product = weaverseShopifyProducts[productId]
  return (
    <div {...rest} ref={ref}>
      {productId ? (
        <ProductProvider value={{ product, productId }}>
          {children}
        </ProductProvider>
      ) : (
        'Please select product!'
      )}
    </div>
  )
})

export default ProductBox
