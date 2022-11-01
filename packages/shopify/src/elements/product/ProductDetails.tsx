import React, {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { ProductContext } from '~/context'
import type {
  ProductDetailsProps,
  ShopifyProduct,
  ShopifyProductVariant,
} from '~/types'
import { WeaverseContext } from '@weaverse/react'
import { weaverseShopifyProducts } from '~/proxy'
import { Placeholder } from '~/elements/shared'
import { generateProductImageAspectRatio } from '~/utils/image'

let ProductDetails = forwardRef<HTMLDivElement, ProductDetailsProps>(
  (props, ref) => {
    let { children, productId, productHandle, ...rest } = props
    let { ssrMode } = useContext(WeaverseContext)
    let formRef = useRef<HTMLFormElement>(null)
    let formId = useId()
    let product: ShopifyProduct = weaverseShopifyProducts[productId]
    let [selectedVariant, setSelectedVariant] =
      useState<ShopifyProductVariant | null>(null)

    useEffect(() => {
      if (product) {
        setSelectedVariant(
          product.selected_or_first_available_variant || product.variants[0]
        )
        generateProductImageAspectRatio(product)
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
            {%- assign product_form_id = 'wv-product-form-' | append: wv_product.id -%}
            {%- form 'product',
              product,
              id: ${formId},
              class: 'wv-product-form product-details-form',
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
              product,
              formId,
              formRef,
              selectedVariant,
              setSelectedVariant,
            }}
          >
            <form
              ref={formRef}
              method="post"
              action="/cart/add"
              id={formId}
              acceptCharset="UTF-8"
              encType="multipart/form-data"
              noValidate
              data-product-id={product.id}
              data-product-handle={product.handle}
              className="wv-product-form product-details-form"
            >
              <input type="hidden" name="form_type" value="product" />
              <input type="hidden" name="utf8" value="✓" />
              {children}
            </form>
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
  }
)

ProductDetails.defaultProps = {}

export let css = {
  '@desktop': {
    overflow: 'hidden',
    '.wv-product-form': {
      display: 'flex',
    },
  },
  '@mobile': {
    '.wv-product-form': {
      display: 'block',
    },
  },
}

export default ProductDetails
