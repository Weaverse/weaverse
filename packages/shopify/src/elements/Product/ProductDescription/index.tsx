import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductDescriptionProps } from '~/types'
import { ViewDetails } from './ViewDetails'

let ProductDescription = forwardRef<HTMLDivElement, ProductDescriptionProps>(
  (props, ref) => {
    let {
      lineClamp,
      showViewDetailsButton,
      viewDetailsText,
      children,
      ...rest
    } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product } = context
      let style = {
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lineClamp,
      } as React.CSSProperties
      return (
        <div ref={ref} {...rest}>
          <div
            className="wv-product-description"
            style={style}
            dangerouslySetInnerHTML={{ __html: product.body_html }}
          />
          {showViewDetailsButton && (
            <ViewDetails viewDetailsText={viewDetailsText}>
              <div dangerouslySetInnerHTML={{ __html: product.body_html }} />
            </ViewDetails>
          )}
        </div>
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
    '.wv-view-details-button': {
      display: 'block',
      marginTop: '16px',
      padding: '8px 16px',
      border: '1px solid #000',
    },
  },
}

ProductDescription.defaultProps = {
  lineClamp: 3,
  showViewDetailsButton: true,
  viewDetailsText: 'View details',
}

export default ProductDescription
