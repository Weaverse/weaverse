import React, { forwardRef, useContext, useId, useState } from 'react'
import type { TODO } from '@weaverse/react'
import { ProductContext } from './context'
import { WeaverseContext } from '@weaverse/react'

let ProductAtc = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { buttonText, cartAction, ...rest } = props
  let { productId, formId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let [status, setStatus] = useState('')
  let { ssrMode } = weaverseContext
  let handleATC = (e: React.MouseEvent) => {
    if (!cartAction) {
      // @ts-ignore
      let formElement = ref?.current as HTMLFormElement
      e.preventDefault()
      setStatus('adding')
      // @ts-ignore
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'post',
        body: new FormData(formElement),
      })
        .then((response) => response.json())
        .then((res) => {
          setStatus('added')
          setTimeout(() => {
            setStatus('')
          }, 2000)
          // handle after adding item
          window.alert(
            'Product successfully added to cart: ' + res?.variant_title
          )
        })
    }
  }
  if (!productId) {
    return null
  }
  console.info('9779 formid', formId)
  if (ssrMode) {
    return (
      <div ref={ref} {...rest}>
        {`{%- form 'product', product_${productId}, id: '${formId}', class: 'form', novalidate: 'novalidate', data-type: 'add-to-cart-form' -%}`}
        <button>{buttonText}</button>
        {`{% endform %}`}
      </div>
    )
  }
  let text =
    status === 'adding'
      ? rest.addingText
      : status === 'added'
      ? rest.addedText
      : buttonText
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
      <button disabled={!!status} onClick={handleATC}>
        {text}
      </button>
    </form>
  )
})

ProductAtc.defaultProps = {
  buttonText: 'Add to cart',
  addingText: 'Item adding',
  addedText: 'Item added',
  cartAction: '',
  css: {
    '@desktop': {
      button: {
        border: 'none',
        // borderRadius: 50,
        padding: '6px 20px',
        fontSize: 18,
        color: '#fff',
        background: '#B8ACA8',
        width: '100%',
        height: '100%',
      },
    },
  },
}

export default ProductAtc
