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
        display: 'none',
      },
      div: {
        display: 'block',
      },
      '& > *:first-child': {
        margin: 0,
      },
    },
    '.wv-view-details-button': {
      outline: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      padding: '0',
      color: 'rgb(56, 142, 255)',
      '&:hover': {
        textDecoration: 'underline',
        color: 'rgb(0, 42, 140)',
      },
    },
  },
}

ProductDescription.defaultProps = {
  lineClamp: 3,
  showViewDetailsButton: true,
  viewDetailsText: 'View details',
}

export default ProductDescription
