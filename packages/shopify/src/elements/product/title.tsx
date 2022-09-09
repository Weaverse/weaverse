import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'

let ProductTitle = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  if (!productId) {
    return null
  }
  return (
    <h2 ref={ref} {...rest}>
      {ssrMode ? `{{ product_${productId}.title }}` : product?.title}
    </h2>
  )
})

ProductTitle.defaultProps = {
  css: {
    '@desktop': {
      fontSize: 32,
      lineHeight: '48px',
      margin: 0,
    },
  },
}

export default ProductTitle
