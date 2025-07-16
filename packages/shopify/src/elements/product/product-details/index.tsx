import type { ElementCSS } from '@weaverse/react'
import { forwardRef } from 'react'
import { Components } from '~/components'
import { ProductContext } from '~/context'
import { useWeaverseShopify } from '~/hooks/use-weaverse-shopify'
import type { ProductDetailsProps } from '~/types'
import { ProductSkeleton, css as skeletonCss } from './skeleton'
import { useProduct } from './use-product'

let ProductDetails = forwardRef<HTMLDivElement, ProductDetailsProps>(
  (props, ref) => {
    let {
      children,
      product: productPickerData,
      productId,
      productHandle,
      useDefaultProduct,
      ...rest
    } = props
    productId ??= productPickerData?.id || 'default'
    productHandle ??= productPickerData?.handle || ''

    let { ssrMode, isDesignMode } = useWeaverseShopify()
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
              acceptCharset="UTF-8"
              action="/cart/add"
              className="wv-product-form product-details-form"
              data-product-handle={product.handle}
              data-product-id={product.id}
              encType="multipart/form-data"
              id={`wv-product-form-${product.id}`}
              method="post"
              noValidate
              ref={formRef}
            >
              <input name="form_type" type="hidden" value="product" />
              <input name="utf8" type="hidden" value="✓" />
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
