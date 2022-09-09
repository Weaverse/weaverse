import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { ProductContext } from './context'
import { WeaverseContext } from '@weaverse/react'

let ProductVariant = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId, formId, variantId, onChangeVariant } =
    useContext(ProductContext)
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
    <select
      name="id"
      defaultValue={variantId}
      onChange={(e) => onChangeVariant(Number.parseInt(e.target.value))}
      form={formId}
      ref={ref}
      {...rest}
    >
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
      background: '#f0f0f0f0',
    },
  },
}

export default ProductVariant
