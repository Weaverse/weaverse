import React, { forwardRef } from 'react'
import {
  ProductListProvider,
  weaverseShopifyProductLists,
} from '../product/context'
import type { ProductListProps } from '~/types'

let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
  let {
    collectionId,
    productNumber,
    rows,
    itemsPerSlide,
    containerHeight,
    children,
    ...rest
  } = props
  let productIds = weaverseShopifyProductLists[collectionId || 'all'] || []
  let styles = {
    ['--container-height']: containerHeight,
    ['--items-per-row']: itemsPerSlide,
  } as React.CSSProperties

  return (
    <div ref={ref} {...rest} style={styles}>
      {productIds.length
        ? productIds.slice(0, productNumber).map((productId: number) => (
            <ProductListProvider
              key={productId}
              value={{
                productId,
              }}
            >
              {children}
            </ProductListProvider>
          ))
        : 'Select collection'}
    </div>
  )
})

export default ProductList

ProductList.defaultProps = {
  collectionId: '291152593080',
  productNumber: 4,
  rows: 1,
  itemsPerSlide: 4,
  containerHeight: 'auto',
}

export let permanentCss = {
  '@desktop': {
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--items-per-row), 1fr)',
    gap: 8,
    '& [data-wv-type]:not([data-wv-type="product-box"])': {
      textAlign: 'center',
    },
    '& [data-wv-type="product-box"]': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    '& [data-wv-type="product-title"]': {
      flex: 1,
    },
  },
}
