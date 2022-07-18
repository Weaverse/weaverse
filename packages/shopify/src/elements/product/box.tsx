import React, { forwardRef } from 'react'
import { ProductProvider, weaverseShopifyProducts } from './context'
import { ProductBoxProps } from '../../type'

export let ProductBox = forwardRef<any, ProductBoxProps>((props, ref) => {
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
