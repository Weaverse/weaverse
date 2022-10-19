import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductMediaProps, ProductMediaSize } from '~/types'

let mediaSizesMap: Record<ProductMediaSize, string> = {
  small: '40%',
  medium: '50%',
  large: '60%',
}

// https://keen-slider.io/examples
let ProductMedia = forwardRef<HTMLDivElement, ProductMediaProps>(
  (props, ref) => {
    let { mediaSize, ...rest } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product } = context
      let style = {
        '--product-media-width': mediaSizesMap[mediaSize],
      } as React.CSSProperties
      return (
        <div ref={ref} style={style} {...rest}>
          <img src={product.images[0].src} />
        </div>
      )
    }
    return null
  }
)

export let css: ElementCSS = {
  '@desktop': {
    flexGrow: 1,
    width: 'var(--product-media-width, 50%)',
    overflow: 'hidden',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  '@mobile': {
    width: '100%',
  },
}

export default ProductMedia
