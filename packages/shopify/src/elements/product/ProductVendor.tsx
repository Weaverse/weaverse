import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductVendorProps } from '~/types'

let ProductVendor = forwardRef<HTMLDivElement, ProductVendorProps>(
  (props, ref) => {
    let { showLabel, labelText, ...rest } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product } = context
      return (
        <div ref={ref} {...rest}>
          {showLabel && (
            <span className="wv-product-vendor__label">{labelText}</span>
          )}
          <a
            target="_self"
            href={`/collections/vendors?q=${product.vendor}`}
            className="wv-produt-vendor__link"
          >
            {product.vendor}
          </a>
        </div>
      )
    }
    return null
  }
)

ProductVendor.defaultProps = {
  showLabel: true,
  labelText: 'By',
}

export let css: ElementCSS = {
  '@desktop': {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    '.wv-product-vendor__label': {
      fontSize: '15px',
      lineHeight: '1.4em',
      fontWeight: '600',
      marginRight: '4px',
    },
    '.wv-produt-vendor__link': {
      color: '#666666',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      textDecorationColor: 'rgba(193, 100, 82, 0.4)',
      textDecorationThickness: '1px',
      textTransform: 'capitalize',
    },
  },
}

export default ProductVendor
