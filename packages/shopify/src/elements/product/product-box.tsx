import React, {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'
import { ProductContext } from '~/context'
import type {
  ProductBoxProps,
  ShopifyProduct,
  ShopifyProductVariant,
} from '~/types'
import { WeaverseContext } from '@weaverse/react'
import { weaverseShopifyProducts } from '~/proxy'
import { Placeholder } from '~/elements/shared'

let ProductBox = forwardRef<HTMLDivElement, ProductBoxProps>((props, ref) => {
  let { children, productId, productHandle, ...rest } = props
  let { ssrMode } = useContext(WeaverseContext)
  let formId = useId()
  let product: ShopifyProduct = weaverseShopifyProducts[productId]
  let [selectedVariant, setSelectedVariant] =
    useState<ShopifyProductVariant | null>(null)

  useEffect(() => {
    if (product) {
      // TODO
      let selectedOrFirstAvailableVariant = product.variants[0]
      setSelectedVariant(selectedOrFirstAvailableVariant)
    }
  }, [product])

  if (product) {
    if (ssrMode) {
      return (
        <div {...rest} ref={ref}>
          {`
            {%- unless wv_product -%}
              {%- assign wv_product = product_${productId} -%}
            {%- endunless -%}
            {%- assign product_form_id = 'weaverse-product-form-' | append: wv_product.id -%}
            {%- form 'product',
              product,
              id: ${formId},
              class: 'weaverse-product-form form main-product',
              novalidate: 'novalidate',
              data-product-id: wv_product.id,
              data-product-handle: wv_product.handle,
            -%}
          `}
          {children}
          {`{%- endform -%}`}
        </div>
      )
    }

    return (
      <div {...rest} ref={ref}>
        <ProductContext.Provider
          value={{
            ssrMode,
            formId,
            product,
            selectedVariant,
            setSelectedVariant,
          }}
        >
          {children}
        </ProductContext.Provider>
      </div>
    )
  }

  return (
    <div {...rest} ref={ref}>
      <Placeholder element="Product">
        {productId
          ? 'Loading product data...'
          : 'Select a product and start editing.'}
      </Placeholder>
    </div>
  )
})

ProductBox.defaultProps = {}

export let css = {
  '@desktop': {
    display: 'flex',
    overflow: 'hidden',
    padding: '10px',
  },
  '@mobile': {
    display: 'block',
  },
}

export default ProductBox
