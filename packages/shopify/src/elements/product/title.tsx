import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'

export let ProductTitle = forwardRef((props: any, ref) => {
  let {...rest} = props
  let { product, productId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  console.log('product title', product)
  let {ssrMode} = weaverseContext
  if (!productId) {
    return null
  }
  return <div ref={ref} {...rest}>
    {ssrMode ? `{{ product_${productId}.title }}` : product?.title}
  </div>
})