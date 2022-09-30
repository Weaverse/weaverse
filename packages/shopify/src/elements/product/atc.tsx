import React, { forwardRef, useContext, useState } from 'react'
import { WeaverseContext } from '@weaverse/react'
import type { ProductAtcProps } from '~/types'
import { ProductContext } from '~/elements/context'

let ProductAtc = forwardRef<HTMLDivElement, ProductAtcProps>((props, ref) => {
  let {
    buttonText,
    addingText,
    addedText,
    soldOutText,
    unavailableText,
    goToCart,
    ...rest
  } = props
  let { productId, product, variantId, formId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let [status, setStatus] = useState('')
  let { ssrMode } = weaverseContext
  let handleATC = (e: React.MouseEvent) => {
    if (!goToCart) {
      // stay here action
      // @ts-ignore
      let formElement = ref?.current.querySelector('form') as HTMLFormElement
      console.info('9779 form', formElement)
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
  if (!productId || !product) {
    return null
  }
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
      ? addingText
      : status === 'added'
      ? addedText
      : buttonText
  let variantIndex = Math.max(
    product.variants.findIndex((v) => v.id === variantId),
    0
  )
  let variant = product.variants[variantIndex]
  let isSoldOut = false
  // let isSoldOut = (variant?.inventory_quantity || 0) <= 0
  return (
    <div ref={ref} {...rest}>
      <form
        method="post"
        action="/cart/add"
        id={formId}
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        noValidate
        data-type="add-to-cart-form"
      >
        <input type="hidden" name="form_type" value="product" />
        <input type="hidden" name="utf8" value="✓" />
        <button disabled={!!status || isSoldOut} onClick={handleATC}>
          {isSoldOut ? soldOutText : text}
        </button>
      </form>
    </div>
  )
})

export let css = {
  '@desktop': {
    form: {
      height: '100%',
    },
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
}

ProductAtc.defaultProps = {
  buttonText: 'Add to cart',
  addingText: 'Item adding',
  addedText: 'Item added',
  soldOutText: 'Sold Out',
  unavailableText: 'Unavailable',
  // cartAction: '',
  goToCart: false,
}

export default ProductAtc
