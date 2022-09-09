import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'

let ProductImage = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId, variantId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let images = product?.media || product?.images || []
  console.info('9779 images', ssrMode, images)
  if (!productId || !images.length) {
    return null
  }
  let variants = product?.variants || []
  let variant = variants.find((variant) => variant.id === variantId)
  let imageId = variant?.image_id || variant?.featured_media.id
  let image = images.find((img) => img.id === imageId)
  let src = image?.src || product?.featured_image || product?.image.src
  return (
    <div ref={ref} {...rest}>
      {ssrMode ? (
        <img
          src={`{{ product_${productId}.featured_image }}`}
          alt="featured image"
        />
      ) : (
        <img
          width={image?.width}
          height={image?.height}
          src={src}
          alt={image?.alt || undefined}
        />
      )}
    </div>
  )
})

ProductImage.defaultProps = {
  css: {
    '@desktop': {
      img: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      },
    },
  },
}

export default ProductImage
