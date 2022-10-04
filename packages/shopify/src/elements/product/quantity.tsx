import React, { forwardRef, useContext, useState } from 'react'
import { ProductContext } from '~/elements/context'
import type { ElementCSS } from '@weaverse/core'

let ProductQuantity = forwardRef<HTMLDivElement>((props, ref) => {
  let { ...rest } = props
  let { formId } = useContext(ProductContext)
  let [quantity, setQuantity] = useState(1)
  return (
    <div ref={ref} {...rest}>
      <div>
        <button
          disabled={quantity <= 1}
          onClick={() => setQuantity(quantity - 1)}
        >
          -
        </button>
        <input type="number" name="quantity" value={quantity} form={formId} />
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    width: '100%',
    div: {
      border: '1px solid #ddd',
      width: 'fit-content',
    },
    input: {
      padding: 8,
      height: 48,
      width: 56,
      textAlign: 'center',
      border: 'none',
      background: '#inherit',
      outline: 'none',
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
    button: {
      width: 48,
      height: 48,
      padding: 0,
      border: 'none',
      background: 'inherit',
      cursor: 'pointer',
    },
  },
}

ProductQuantity.defaultProps = {}

export default ProductQuantity
