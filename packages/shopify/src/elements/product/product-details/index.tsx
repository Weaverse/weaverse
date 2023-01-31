import type { ElementCSS } from '@weaverse/react'
import { Components, WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductDetailsProps } from '~/types'
import { ProductSkeleton, css as skeletonCss } from './_skeleton'
import { useProduct } from './use-product'

let ProductDetails = forwardRef<HTMLDivElement, ProductDetailsProps>(
  (props, ref) => {
    let { children, productId, productHandle, useDefaultProduct, ...rest } =
      props
    let { ssrMode, isDesignMode } = useContext(WeaverseContext)
    let { product, ready, formRef, selectedVariant, setSelectedVariant } =
      useProduct(productId, useDefaultProduct)

    let shouldRenderSkeleton = Boolean(
      (isDesignMode && productId && !product) ||
        (ssrMode && (productId || useDefaultProduct))
    )
    let shouldRenderProduct = Boolean((isDesignMode && productId) || product)

    if (shouldRenderSkeleton) {
      return (
        <div {...rest} ref={ref}>
          <ProductSkeleton />
        </div>
      )
    }

    if (shouldRenderProduct) {
      return (
        <div {...rest} ref={ref}>
          <ProductContext.Provider
            value={{
              product,
              ready,
              formRef,
              selectedVariant,
              setSelectedVariant,
            }}
          >
            <form
              ref={formRef}
              method="post"
              action="/cart/add"
              id={`wv-product-form-${product.id}`}
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
        <Components.Placeholder element="Product">
          Select a product and start editing.
        </Components.Placeholder>
      </div>
    )
  }
)

ProductDetails.defaultProps = {
  useDefaultProduct: false,
}

export let css: ElementCSS = {
  '@desktop': {
    overflow: 'hidden',
    '&.image-zoomed': {
      zIndex: 999,
    },
    '.wv-product-form': {
      display: 'flex',
      maxHeight: '100%',
    },
    ...skeletonCss['@desktop'],
  },
  '@mobile': {
    '.wv-product-form': {
      display: 'block',
    },
    ...skeletonCss['@mobile'],
  },
}

export default ProductDetails
