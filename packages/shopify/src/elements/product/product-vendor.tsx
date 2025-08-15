import type { ElementCSS } from '@weaverse/react'
import { forwardRef } from 'react'

import { useProductContext } from '~/hooks/use-product-context'
import type { ProductVendorProps } from '~/types'

let ProductVendor = forwardRef<HTMLDivElement, ProductVendorProps>(
  (props, ref) => {
    let { showLabel, labelText, clickAction, openInNewTab, ...rest } = props
    let { product } = useProductContext()
    return (
      <div ref={ref} {...rest}>
        {showLabel && (
          <span className="wv-product-vendor__label">{labelText}</span>
        )}
        {clickAction === 'none' ? (
          <span className="wv-produt-vendor__text">{product.vendor}</span>
        ) : (
          <a
            className="wv-produt-vendor__text"
            href={`/collections/vendors?q=${product.vendor}`}
            rel="noreferrer"
            target={openInNewTab ? '_blank' : '_self'}
          >
            {product.vendor}
          </a>
        )}
      </div>
    )
  }
)

ProductVendor.defaultProps = {
  showLabel: true,
  labelText: 'By',
  clickAction: 'openLink',
  openInNewTab: true,
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
      fontWeight: 'bold',
      marginRight: '4px',
    },
    '.wv-produt-vendor__text': {
      color: '#666666',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      textTransform: 'capitalize',
    },
  },
}

export default ProductVendor
