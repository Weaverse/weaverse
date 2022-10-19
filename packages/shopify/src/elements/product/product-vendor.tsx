import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductVendorProps } from '~/types'

let ProductVendor = forwardRef<HTMLDivElement, ProductVendorProps>(
  (props, ref) => {
    let { ...rest } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product, ssrMode } = context
      return (
        <div ref={ref} {...rest}>
          {ssrMode ? '{{ wv_product.vendor }}' : product.vendor}
        </div>
      )
    }
    return null
  }
)

export let css: ElementCSS = {
  '@desktop': {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
}

export default ProductVendor
