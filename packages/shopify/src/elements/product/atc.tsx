import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { ProductContext } from './context'

let ProductAtc = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { buttonText, ...rest } = props
  let { productId } = useContext(ProductContext)
  if (!productId) {
    return null
  }
  return (
    <button ref={ref} {...rest}>
      {buttonText}
    </button>
  )
})

ProductAtc.defaultProps = {
  buttonText: 'Add to cart',
  css: {
    '@desktop': {
      border: 'none',
      borderRadius: 50,
      padding: '6px 20px',
      color: '#fff',
      background: '#B8ACA8',
    },
  },
}

export default ProductAtc
