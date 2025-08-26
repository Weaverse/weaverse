import type { CombinedVariantProps } from '~/types'

export function CombinedVariantSelector({ context }: CombinedVariantProps) {
  let { product, selectedVariant, setSelectedVariant } = context

  if (!product.variants) {
    return null
  }

  return (
    <>
      <label className="wv-combined-variant__label" htmlFor="id">
        Select variant
      </label>
      <select
        className="wv-combined-variant__selector"
        name="id"
        onChange={(e) => {
          let variantId = Number(e.target.value)
          let variant = product.variants.find(({ id }) => id === variantId)
          if (variant) {
            setSelectedVariant(variant)
          }
        }}
        value={selectedVariant?.id}
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
