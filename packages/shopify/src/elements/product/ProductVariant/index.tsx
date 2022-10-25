import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductVariantProps } from '~/types'

let ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  (props, ref) => {
    let { optionsStyle, ...rest } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product, selectedVariant, setSelectedVariant, ssrMode } = context
      let { variants } = product
      let hasOnlyDefaultVariant =
        product.has_only_default_variant || variants.length === 1
      if (!hasOnlyDefaultVariant) {
        return (
          <div ref={ref} {...rest}>
            <label htmlFor="id" className="wv-variant-selector-label">
              Select variant
            </label>
            <select
              className="wv-variant-dropdown combined-variant"
              name="id"
              value={selectedVariant?.id}
              onChange={(e) => {
                let variantId = Number(e.target.value)
                let variant = variants.find(({ id }) => id === variantId)
                if (variant) {
                  setSelectedVariant(variant)
                }
              }}
            >
              {variants.map((variant) => {
                return (
                  <option key={variant.id} value={variant.id}>
                    {variant.title}
                  </option>
                )
              })}
            </select>
          </div>
        )
      }
      return (
        <div ref={ref} {...rest}>
          <input type="hidden" name="id" value={selectedVariant?.id} />
        </div>
      )
    }
    return null
  }
)

ProductVariant.defaultProps = {
  optionsStyle: 'combined',
}

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    '.wv-variant-selector-label': {
      marginBottom: '10px',
    },
    '.wv-variant-dropdown': {
      backgroundColor: '#fff',
      border: '1px solid #ebebeb',
      lineHeight: '48px',
      transition: '.3s all',
      fontSize: '16px',
      height: '48px',
      width: 'fit-content',
      minWidth: '120px',
    },
  },
}

export default ProductVariant
