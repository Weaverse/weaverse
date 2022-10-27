import React from 'react'
import type { CombinedVariantProps } from '~/types'

export function CombinedVariantSelector({ context }: CombinedVariantProps) {
  let { product, selectedVariant, setSelectedVariant } = context
  return (
    <>
      <label htmlFor="id" className="wv-combined-variant__label">
        Select variant
      </label>
      <select
        className="wv-combined-variant__selector"
        name="id"
        value={selectedVariant?.id}
        onChange={(e) => {
          let variantId = Number(e.target.value)
          let variant = product.variants.find(({ id }) => id === variantId)
          if (variant) {
            setSelectedVariant(variant)
          }
        }}
      >
        {product.variants.map((variant) => {
          return (
            <option key={variant.id} value={variant.id}>
              {variant.title}
            </option>
          )
        })}
      </select>
    </>
  )
}
