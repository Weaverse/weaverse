import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductDescriptionProps } from '~/types'

let ProductDescription = forwardRef<HTMLDivElement, ProductDescriptionProps>(
  (props, ref) => {
    let { lineClamp, children, ...rest } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product, ssrMode } = context
      let style = {
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lineClamp,
      } as React.CSSProperties

      if (ssrMode) {
        return (
          <div ref={ref} {...rest} style={style}>
            {`{{- wv_product.description -}}`}
          </div>
        )
      }

      return (
        <div
          ref={ref}
          {...rest}
          style={style}
          dangerouslySetInnerHTML={{ __html: product.body_html }}
        />
      )
    }
    return null
  }
)

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '16px',
    marginBottom: '24px',
    '.wv-product-description': {
      overflow: 'hidden',
      display: '-webkit-box',
      img: {
        maxWidth: '100%',
        display: 'none',
      },
      div: {
        display: 'block',
      },
    },
  },
}

ProductDescription.defaultProps = {
  lineClamp: 3,
}

export default ProductDescription
