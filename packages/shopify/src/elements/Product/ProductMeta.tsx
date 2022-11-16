import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductMetaProps } from '~/types'

let ProductMeta = forwardRef<HTMLDivElement, ProductMetaProps>((props, ref) => {
  let { showSKU, showTags, showVendor, showType, ...rest } = props
  let context = useContext(ProductContext)

  if (context) {
    let { product, selectedVariant } = context
    return (
      <div ref={ref} {...rest}>
        <ul className="wv-product-meta">
          {showSKU ? (
            <li>
              <div className="meta-label">SKU:</div>
              <div className="meta-value">{selectedVariant?.sku || 'N/A'}</div>
            </li>
          ) : null}
          {showTags && product.tags.length ? (
            <li>
              <div className="meta-label">Tags:</div>
              <div className="meta-value">{product.tags}</div>
            </li>
          ) : null}
          {showVendor && product.vendor ? (
            <li>
              <div className="meta-label">Vendor:</div>
              <div className="meta-value">{product.vendor}</div>
            </li>
          ) : null}
          {showType && product.product_type ? (
            <li>
              <div className="meta-label">Category:</div>
              <div className="meta-value">{product.product_type}</div>
            </li>
          ) : null}
        </ul>
      </div>
    )
  }
  return null
})

ProductMeta.defaultProps = {
  showSKU: true,
  showTags: true,
  showVendor: true,
  showType: true,
}

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '30px',
    '.wv-product-meta': {
      padding: 0,
      margin: 0,
      li: {
        listStyle: 'none',
        lineHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        '.meta-label': {
          minWidth: '150px',
          fontWeight: '500',
        },
      },
    },
  },
}

export default ProductMeta
