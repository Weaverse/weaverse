import type { ElementCSS } from '@weaverse/react'
import { Components } from '@weaverse/react'
import React, { forwardRef } from 'react'
import {
  weaverseShopifyProducts,
  weaverseShopifyProductsByCollection,
} from '~/proxy'
import type { ProductListProps, ShopifyProduct } from '~/types'
import { ProductCard, productCardCss } from './ProductCard'
import { SliderContainer } from './SliderContainer'

let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
  let {
    source,
    collectionId,
    collectionHandle,
    productIds,
    layout,
    productCount,
    productsPerRow,
    gap,
    imageAspectRatio,
    showSecondImageOnHover,
    showSaleBadge,
    showViewDetailsButton,
    viewDetailsButtonText,
    showQuickViewButton,
    children,
    ...rest
  } = props

  let shouldShowPlaceholder =
    (source === 'collection' && !collectionId) ||
    (source === 'fixedProducts' && !productIds?.length)

  if (shouldShowPlaceholder) {
    let placeholderText =
      source === 'collection'
        ? 'Select a collection and start editing.'
        : 'Select some products and start editing.'
    return (
      <div ref={ref} {...rest}>
        <Components.Placeholder element="Product List">
          {placeholderText}
        </Components.Placeholder>
      </div>
    )
  }

  let productsByCollection: number[] =
    weaverseShopifyProductsByCollection[collectionId] || []
  productsByCollection.splice(productCount)
  let products: ShopifyProduct[] = productsByCollection.map(
    (pId) => weaverseShopifyProducts[pId]
  )
  let rows = Math.ceil(productCount / productsPerRow)
  let style = {
    '--gap': `${gap}px`,
    '--product-per-row': productsPerRow,
    '--display': layout === 'grid' ? 'grid' : 'block',
    '--rows': rows,
  } as React.CSSProperties

  let productCards = products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      imageAspectRatio={imageAspectRatio}
      showSecondImageOnHover={showSecondImageOnHover}
      showSaleBadge={showSaleBadge}
      showViewDetailsButton={showViewDetailsButton}
      viewDetailsButtonText={viewDetailsButtonText}
      showQuickViewButton={showQuickViewButton}
      className={layout === 'slider' ? 'keen-slider__slide' : ''}
    />
  ))

  if (layout === 'slider') {
    return (
      <div ref={ref} {...rest} style={style}>
        <SliderContainer>{productCards}</SliderContainer>
      </div>
    )
  }

  return (
    <div ref={ref} {...rest} style={style}>
      {productCards}
    </div>
  )
})

export default ProductList

ProductList.defaultProps = {
  source: 'collection',
  layout: 'grid',
  productCount: 8,
  productsPerRow: 4,
  gap: 16,
  imageAspectRatio: 'auto',
  showSecondImageOnHover: true,
  showViewDetailsButton: true,
  viewDetailsButtonText: 'View details',
  showQuickViewButton: true,
  showSaleBadge: true,
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'var(--display, grid)',
    gridTemplateColumns: 'repeat(var(--product-per-row), 1fr)',
    gap: 'var(--gap, 16px)',
    overflow: 'hidden',
    ...productCardCss['@desktop'],
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(--rows, 1fr) 0',
    },
  },
  '@mobile': {
    display: 'flex',
    overflow: 'auto',
    scrollBehavior: 'smooth',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 0,
    ...productCardCss['@mobile'],
    '.wv-product-list__slider': {
      '.wv-product-card': {
        padding: '0 32px',
      },
    },
  },
}
