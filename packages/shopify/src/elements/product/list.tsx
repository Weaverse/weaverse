import React, { forwardRef, useContext } from 'react'
import { ProductListContext } from '~/context'
import type { ProductListProps } from '~/types'
import { WeaverseContext } from '@weaverse/react'
import * as Carousel from '~/elements/shared/Carousel'
import { weaverseShopifyProductLists } from '~/proxy'

let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
  let {
    collectionId,
    collectionHandle,
    productNumber,
    itemsPerSlide,
    itemsSpacing,
    children,
    ...rest
  } = props
  let { ssrMode } = useContext(WeaverseContext)
  let productIds = weaverseShopifyProductLists[collectionId || 'all'] || []

  if (ssrMode) {
    return (
      <div ref={ref} {...rest}>
        {` {% for wv_product in collections['${collectionHandle}'].products %} `}
        {children}
        {` {% endfor %} `}
      </div>
    )
  }

  let renderContent = () => (
    <Carousel.default itemsPerSlide={itemsPerSlide} gap={itemsSpacing}>
      {productIds.slice(0, productNumber).map((productId: number) => (
        <ProductListContext.Provider
          key={productId}
          value={{
            productId,
          }}
        >
          {children}
        </ProductListContext.Provider>
      ))}
    </Carousel.default>
  )
  return (
    <div ref={ref} {...rest}>
      {productIds.length ? renderContent() : 'Select collection'}
    </div>
  )
})

export default ProductList

ProductList.defaultProps = {
  collectionId: 291152986296,
  collectionHandle: 'men',
  productNumber: 12,
  itemsPerSlide: 4,
  itemsSpacing: 8,
}

export let permanentCss = {
  '@desktop': {
    '& [data-wv-type]:not([data-wv-type="product-box"])': {
      textAlign: 'center',
    },
    '& [data-wv-type="product-box"]': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      height: '100%',
    },
    '& [data-wv-type="product-image"] img': {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
    },
    '& [data-wv-type="product-title"]': {
      flex: 1,
    },

    ...Carousel.css,
  },
}
