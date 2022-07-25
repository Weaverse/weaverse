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
    <div ref={ref} {...rest}>
      {ssrMode ? `{{ product_${productId}.title }}` : product?.title}
    </div>
  )
})

export default ProductTitle
