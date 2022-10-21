import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductMetaProps } from '~/types'

let ProductMeta = forwardRef<HTMLDivElement, ProductMetaProps>((props, ref) => {
  let { showSKU, showTags, showVendor, showType, ...rest } = props
  let context = useContext(ProductContext)

  if (context) {
    let { product, selectedVariant, ssrMode } = context
    return (
      <div ref={ref} {...rest}>
        <ul className="wv-product-meta">
          {showSKU ? (
            <li>
              <div className="meta-label">SKU:</div>
              <div className="meta-value">
                {ssrMode
                  ? `{{- wv_product.selected_or_first_available_variant.sku | default: 'N/A' -}}`
                  : selectedVariant?.sku || 'N/A'}
              </div>
            </li>
          ) : null}
          {showTags ? (
            <li>
              <div className="meta-label">Tags:</div>
              <div className="meta-value">
                {ssrMode ? `{{- wv_product.tags -}}` : product.tags}
              </div>
            </li>
          ) : null}
          {showVendor ? (
            <li>
              <div className="meta-label">Vendor:</div>
              <div className="meta-value">
                {ssrMode ? `{{- wv_product.vendor -}}` : product.vendor}
              </div>
            </li>
          ) : null}
          {showType && product.product_type ? (
            <li>
              <div className="meta-label">Category:</div>
              <div className="meta-value">
                {ssrMode ? `{{- wv_product.type -}}` : product.product_type}
              </div>
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
        lineHeight: '42px',
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
