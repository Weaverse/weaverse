import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from '../context'
import type { ProductTitleProps } from '~/types'

let ProductTitle = forwardRef<HTMLElement, ProductTitleProps>((props, ref) => {
  let { htmlTag, linkProduct, ...rest } = props
  let { product } = useContext(ProductContext)
  let { ssrMode } = useContext(WeaverseContext)
  let productHandle = ssrMode ? `{{ wv_product.handle }}` : product.handle
  let productLink = `/products/${productHandle}`
  let content = (
    <span>{ssrMode ? `{{ wv_product.title }}` : product.title}</span>
  )
  if (linkProduct) {
    content = (
      <a href={productLink}>
        {ssrMode ? `{{ wv_product.title }}` : product.title}
      </a>
    )
  }
  return React.createElement(htmlTag, { ref, ...rest }, content)
})

export let css: ElementCSS = {
  '@desktop': {
    fontSize: 24,
    lineHeight: '48px',
    // margin: 0,
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
