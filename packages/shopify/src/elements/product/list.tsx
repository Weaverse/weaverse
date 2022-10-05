import React, { forwardRef, useContext } from 'react'
import { ProductListContext, weaverseShopifyProductLists } from '../context'
import type { ProductListProps } from '~/types'
import { WeaverseContext } from '@weaverse/react'

let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
  let {
    collectionId,
    collectionHandle,
    productNumber,
    rows,
    itemsPerSlide,
    containerHeight,
    children,
    ...rest
  } = props
  let { ssrMode } = useContext(WeaverseContext)
  let productIds = weaverseShopifyProductLists[collectionId || 'all'] || []
  let styles = {
    ['--container-height']: containerHeight,
    ['--items-per-row']: itemsPerSlide,
  } as React.CSSProperties
  if (ssrMode) {
    return (
      <div ref={ref} {...rest} style={styles}>
        {` {% for wv_product in collections['${collectionHandle}'].products %} `}
        {children}
        {` {% endfor %} `}
      </div>
    )
  }
  return (
    <div ref={ref} {...rest} style={styles}>
      {productIds.length
        ? productIds.slice(0, productNumber).map((productId: number) => (
            <ProductListContext.Provider
              key={productId}
              value={{
                productId,
              }}
            >
              {children}
            </ProductListContext.Provider>
          ))
        : 'Select collection'}
    </div>
  )
})

export default ProductList

ProductList.defaultProps = {
  collectionId: 291152986296,
  collectionHandle: 'men',
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
    '& [data-wv-type="product-image"] img': {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
    },
    '& [data-wv-type="product-title"]': {
      flex: 1,
    },
  },
}
