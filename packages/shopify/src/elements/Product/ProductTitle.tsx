import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef } from 'react'
import { useProductContext } from '~/hooks'
import type { ProductTitleProps } from '~/types'

let ProductTitle = forwardRef<HTMLElement, ProductTitleProps>((props, ref) => {
  let { htmlTag, ...rest } = props
  let context = useProductContext()

  let { product } = context
  return React.createElement(htmlTag, { ref, ...rest }, product.title)
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
