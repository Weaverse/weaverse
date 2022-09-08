import React, { forwardRef, useContext, useId } from 'react'
import type { TODO } from '@weaverse/react'
import { ProductContext } from './context'
import { WeaverseContext } from '@weaverse/react'

let ProductAtc = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { buttonText, ...rest } = props
  let { productId, formId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext

  if (!productId) {
    return null
  }
  console.info('9779 formid3', formId)
  if (ssrMode) {
    return (
      <div ref={ref} {...rest}>
        {`{%- form 'product', product_${productId}, id: '${formId}', class: 'form', novalidate: 'novalidate', data-type: 'add-to-cart-form' -%}`}
        <button>{buttonText}but2</button>
        {`{% endform %}`}
      </div>
    )
  }
  return (
    <form
      ref={ref}
      {...rest}
      method="post"
      action="/cart/add"
      id={formId}
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      noValidate="novalidate"
      data-type="add-to-cart-form"
    >
      <input type="hidden" name="form_type" value="product" />
      <input type="hidden" name="utf8" value="✓" />
      <button>{buttonText}</button>
    </form>
  )
})

ProductAtc.defaultProps = {
  buttonText: 'Add to cart',
  css: {
    '@desktop': {
      button: {
        border: 'none',
        borderRadius: 50,
        padding: '6px 20px',
        color: '#fff',
        background: '#B8ACA8',
        width: '100%',
        height: '100%',
      },
    },
  },
}

export default ProductAtc
