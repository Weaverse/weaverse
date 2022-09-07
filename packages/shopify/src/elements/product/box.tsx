import React, { forwardRef } from 'react'
import { ProductProvider, weaverseShopifyProducts } from './context'
import type { ProductBoxProps } from '~/types'

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
        'Select a product and start editing.'
      )}
    </div>
  )
})

ProductBox.defaultProps = {
  productId: 7176136523960,
  productHandle: 'vans-sk8-hi-decon-cutout-leaves-white',
  css: {
    '@desktop': {},
  },
}

export default ProductBox
