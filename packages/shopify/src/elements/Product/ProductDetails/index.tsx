import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import { Placeholder } from '~/elements/shared'
import type { ProductDetailsProps } from '~/types'
import { ProductSkeleton, skeletonCss } from './Skeleton'
import { useProduct } from './useProduct'

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
        <Placeholder element="Product">
          Select a product and start editing.
        </Placeholder>
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
    '.wv-product-form': {
      display: 'flex',
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
