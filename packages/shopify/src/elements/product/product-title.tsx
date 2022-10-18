import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from '~/context'
import type { ProductTitleProps } from '~/types'

let ProductTitle = forwardRef<HTMLElement, ProductTitleProps>((props, ref) => {
  let { htmlTag, ...rest } = props
  let { ssrMode } = useContext(WeaverseContext)
  let context = useContext(ProductContext)

  if (context) {
    let { product } = context
    let children = product.title
    if (ssrMode) {
      children = `{%- unless wv_product -%}{{ wv_product.title }}{%- endunless -%}`
    }
    return React.createElement(htmlTag, { ref, ...rest }, children)
  }
  return null
})

export let css: ElementCSS = {
  '@desktop': {
    fontSize: '24px',
    lineHeight: '48px',
    margin: '0px',
  },
}

ProductTitle.defaultProps = {
  htmlTag: 'h2',
}

export default ProductTitle
