import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef } from 'react'
import type { ProductInfoProps } from '~/types'

let ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>((props, ref) => {
  let { children, ...rest } = props
  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    flexGrow: 1,
    width: '50%',
    padding: '10px',
  },
}

export default ProductInfo
