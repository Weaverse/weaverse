import React, { forwardRef } from 'react'
import {
  ProductListProvider,
  weaverseShopifyProductLists,
} from '../product/context'
import type { ProductListProps } from '~/types'

let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
  let { collectionId, rows, itemsPerRow, children, ...rest } = props
  let productIds = weaverseShopifyProductLists[collectionId || 'all'] || []
  return (
    <div
      ref={ref}
      {...rest}
      style={{ ['--container-height' as string]: 'auto' }}
    >
      {productIds.length
        ? productIds.slice(0, rows * itemsPerRow).map((productId: number) => (
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
  collectionId: '',
  rows: 1,
  itemsPerRow: 4,
}

export let permanentCss = {
  '@desktop': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    '& [data-wv-type]': {
      textAlign: 'center',
      pointerEvents: 'none',
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
