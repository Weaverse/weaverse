import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductTitleProps } from '~/types'

let ProductTitle = forwardRef<HTMLElement, ProductTitleProps>((props, ref) => {
  let { htmlTag, ...rest } = props
  let context = useContext(ProductContext)

  if (context) {
    let { product } = context
    return React.createElement(htmlTag, { ref, ...rest }, product.title)
  }
  return null
})

export let css: ElementCSS = {
  '@desktop': {
    fontSize: '34px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '46px',
    letterSpacing: '0px',
    wordBreak: 'break-word',
    marginTop: '6px',
    marginBottom: '24px',
    marginLeft: '0px',
    marginRight: '0px',
  },
}

ProductTitle.defaultProps = {
  htmlTag: 'h2',
}

export default ProductTitle
