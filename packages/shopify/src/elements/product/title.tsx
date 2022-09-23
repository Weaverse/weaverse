import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'
import type { ProductTitleProps } from '~/types'

let ProductTitle = forwardRef<HTMLElement, ProductTitleProps>((props, ref) => {
  let { htmlTag, linkProduct, ...rest } = props
  let { product, productId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  if (!productId || !product) {
    return null
  }
  let content = (
    <span>{ssrMode ? `{{ product_${productId}.title }}` : product?.title}</span>
  )
  if (linkProduct) {
    content = (
      <a href={`/product/${product.handle}`}>
        {ssrMode ? `{{ product_${productId}.title }}` : product?.title}
      </a>
    )
  }
  return React.createElement(htmlTag, { ref, ...rest }, [content])
})

export let css: ElementCSS = {
  '@desktop': {
    fontSize: 24,
    lineHeight: '48px',
    margin: 0,
    a: {
      all: 'inherit',
      cursor: 'pointer',
    },
  },
}

ProductTitle.defaultProps = {
  htmlTag: 'h2',
  linkProduct: true,
}

export default ProductTitle
