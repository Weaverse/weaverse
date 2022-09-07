import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'

let ProductImage = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let { product, productId } = useContext(ProductContext)
  let image = product?.image
  console.info('9779 image', image)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  if (!productId || !image) {
    return null
  }
  return (
    <div ref={ref} {...rest}>
      {ssrMode ? (
        `{{ product_${productId}.title }}`
      ) : (
        <img
          width={image.width}
          height={image.height}
          src={image.src}
          alt={image.alt || undefined}
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
