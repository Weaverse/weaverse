import React, { forwardRef, useContext, useState } from 'react'
import type { TODO } from '@weaverse/react'
import { ProductContext } from './context'
import { WeaverseContext } from '@weaverse/react'

let ProductQuantity = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId, formId, variantId, onChangeVariant } =
    useContext(ProductContext)
  let [quantity, setQuantity] = useState(1)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  if (!productId) {
    return null
  }
  // if (ssrMode) {
  //   return (
  //     <select name='id' form={formId} ref={ref} {...rest}>\
  //       `{%%}`
  //     </select>
  //   )
  // }
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

ProductQuantity.defaultProps = {
  css: {
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
  },
}

export default ProductQuantity
