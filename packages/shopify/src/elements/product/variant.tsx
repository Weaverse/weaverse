import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { ProductContext } from './context'

let ProductVariant = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId } = useContext(ProductContext)
  if (!productId) {
    return null
  }
  return (
    <select ref={ref} {...rest}>
      {product?.variants.map((variant) => (
        <option key={variant.id} value={variant.id}>
          {variant.title}
        </option>
      ))}
    </select>
  )
})

ProductVariant.defaultProps = {
  css: {
    '@desktop': {
      width: '100%',
      padding: 10,
      border: 'none',
      background: '#eee',
    },
  },
}

export default ProductVariant
