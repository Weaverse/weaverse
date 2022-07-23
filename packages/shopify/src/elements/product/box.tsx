import React, { forwardRef } from 'react'
import { ProductProvider, weaverseShopifyProducts } from './context'
import { ProductBoxProps } from '../../types'

let ProductBox = forwardRef<HTMLDivElement, ProductBoxProps>((props, ref) => {
  let { children, productId, productHandle, ...rest } = props
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
