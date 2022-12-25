import type { ElementCSS } from '@weaverse/react'
import { Components, WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import type { ProductListProps } from '~/types'
import { ProductCard, productCardCss } from './ProductCard'
import { css as skeletonCss, Skeleton } from './Skeleton'
import { SliderContainer } from './SliderContainer'
import { useProducts } from './useProducts'
let { Placeholder } = Components

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
  let { ssrMode, isDesignMode } = useContext(WeaverseContext)
  let products = useProducts({ source, collectionId, productIds })

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
        <Placeholder element="Product List">{placeholderText}</Placeholder>
      </div>
    )
  }

  let rows = Math.ceil(productCount / productsPerRow)
  let shouldRenderSkeleton = ssrMode || !products.length
  let display = 'grid'
  if (!shouldRenderSkeleton && layout === 'slider') {
    display = 'block'
  }
  let style = {
    '--gap': `${gap}px`,
    '--product-per-row': productsPerRow,
    '--display': display,
    '--rows': rows,
  } as React.CSSProperties

  if (shouldRenderSkeleton) {
    return (
      <div ref={ref} {...rest} style={style}>
        <Skeleton
          productCount={productCount}
          imageAspectRatio={imageAspectRatio}
        />
      </div>
    )
  }

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
        <SliderContainer className="wv-product-list__slider">
          {productCards}
        </SliderContainer>
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
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(var(--rows), 1fr) 0',
    },
    ...productCardCss['@desktop'],
    ...skeletonCss['@desktop'],
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
