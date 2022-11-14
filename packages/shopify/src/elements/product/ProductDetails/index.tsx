import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ProductContext } from '~/context'
import { Placeholder } from '~/elements/shared'
import { weaverseShopifyProducts } from '~/proxy'
import type {
  ProductDetailsProps,
  ShopifyProduct,
  ShopifyProductVariant,
} from '~/types'
import { updateProductData } from '~/utils'
import { ProductSkeleton } from './Skeleton'

let ProductDetails = forwardRef<HTMLDivElement, ProductDetailsProps>(
  (props, ref) => {
    let { children, productId, productHandle, useDefaultProduct, ...rest } =
      props
    let { ssrMode, isDesignMode } = useContext(WeaverseContext)
    let formRef = useRef<HTMLFormElement>(null)

    let product: ShopifyProduct = weaverseShopifyProducts[productId]
    if (useDefaultProduct && !isDesignMode) {
      let defaultProduct = weaverseShopifyProducts['default']
      if (defaultProduct?.id) {
        product = defaultProduct
      }
    }

    let [selectedVariant, setSelectedVariant] =
      useState<ShopifyProductVariant | null>(null)

    useEffect(() => {
      if (product) {
        updateProductData(product)
        setSelectedVariant(
          product.selected_or_first_available_variant || product.variants[0]
        )
        window.weaverseCartHelpers?.notify('on_product_rendered', {
          product,
          formRef,
        })
      }
    }, [product])

    let shouldRenderProduct = (isDesignMode && productId) || product
    let shouldRenderSkeleton = isDesignMode && productId && !product

    if (shouldRenderProduct) {
      let formId = `wv-product-form-${product.id}`
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

    if (shouldRenderSkeleton) {
      return (
        <div {...rest} ref={ref}>
          <ProductSkeleton />
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
      '&.hidden': {
        display: 'none',
      },
    },
    '.wv-product-details-skeleton': {
      display: 'flex',
      gap: '24px',
      div: {
        display: 'block',
      },
      '.wv-media': {
        width: '50%',
        '.wv-media-main-image': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#D1D5DB',
          height: '600px',
          borderRadius: '4px',
          svg: { width: '96px', height: '96px', color: '#E5E7EB' },
        },
        '.wv-media-thumbnails': {
          display: 'flex',
          marginTop: '12px',
          justifyContent: 'space-between',
          '.wv-media-thumbnail-item': {
            backgroundColor: '#D1D5DB',
            height: '120px',
            width: '90px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            svg: { width: '36px', height: '36px', color: '#E5E7EB' },
          },
        },
      },
      '.wv-info': {
        width: '50%',
        '.wv-info-vendor': {
          height: '10px',
          width: '250px',
          marginBottom: '16px',
          backgroundColor: '#E5E7EB',
        },
        '.wv-info-title': {
          marginBottom: '16px',
          display: 'flex',
          gap: '6px',
          '.wv-item': {
            height: '32px',
            width: '180px',
            backgroundColor: '#D1D5DB',
          },
        },
        '.wv-info-price': {
          display: 'flex',
          gap: '6px',
          '.wv-price-item': {
            height: '16px',
            width: '100px',
            backgroundColor: '#E5E7EB',
          },
        },
        '.wv-info-options': {
          margin: '32px 0',
          '.wv-option-circle': {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            '.wv-option-item': {
              height: '50px',
              width: '50px',
              borderRadius: '9999px',
              backgroundColor: '#E5E7EB',
            },
          },
          '.wv-option-round': {
            display: 'flex',
            gap: '10px',
            '.wv-option-item': {
              height: '40px',
              width: '100px',
              borderRadius: '2px',
              backgroundColor: '#E5E7EB',
            },
          },
        },
        '.wv-info-buy-button': {
          height: '52px',
          width: '100%',
          margin: '32px 0',
          backgroundColor: '#D1D5DB',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          svg: { width: '28px', height: '28px' },
        },
        '.wv-info-description': {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          '& > div': { borderRadius: '999px' },
          '.wv-line-1': {
            height: '8px',
            width: '500px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-2': {
            height: '8px',
            width: '550px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-3': {
            height: '8px',
            width: '470px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-4': {
            height: '8px',
            width: '530px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-5': {
            height: '8px',
            width: '510px',
            backgroundColor: '#E5E7EB',
          },
        },
        '.wv-info-meta': {
          margin: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          '& > div': {
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '16px',
            margin: '0 0 12px',
          },
          '.wv-item-1': { width: '350px' },
          '.wv-item-2': { width: '300px' },
          '.wv-item-3': { width: '400px' },
          '.wv-label, .wv-value': {
            height: '16px',
            backgroundColor: '#D1D5DB',
            width: '50%',
            borderRadius: '2px',
          },
        },
      },
    },
  },
  '@mobile': {
    '.wv-product-form': {
      display: 'block',
    },
    '.wv-product-details-skeleton': {
      display: 'block',
      '.wv-media, .wv-info': {
        width: '100%',
      },
      '.wv-media': {
        '.wv-media-main-image': {
          height: '300px',
          marginBottom: '24px',
        },
        '.wv-media-thumbnails': {
          display: 'none',
        },
      },
    },
  },
}

export default ProductDetails
