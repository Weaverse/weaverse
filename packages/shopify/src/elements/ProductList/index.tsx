import type { ElementCSS } from '@weaverse/react'
import { Components, WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import type { ProductListProps } from '~/types'
import { ProductCard, css as productCardCss } from './ProductCard'
import { css as skeletonCss, Skeleton } from './Skeleton'
import { useProducts } from './useProducts'
let { Placeholder, Slider } = Components

let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
  let {
    source,
    collectionId,
    collectionHandle,
    fixedProducts,
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
    showProductOption,
    optionName,
    optionLimit,
    children,
    ...rest
  } = props
  let { ssrMode, isDesignMode } = useContext(WeaverseContext)
  let products = useProducts({
    source,
    collectionId,
    fixedProducts,
    isDesignMode,
  })

  let mainProductId = 0
  if (!ssrMode && !isDesignMode) {
    mainProductId = window.weaverseShopifyConfigs.shopData.product_id
  }
  let shouldShowPlaceholder =
    (source === 'collection' && !collectionId) ||
    (source === 'fixedProducts' && !fixedProducts?.length) ||
    (source === 'recommended' && !ssrMode && !isDesignMode && !mainProductId)

  if (shouldShowPlaceholder) {
    let placeholderText = 'Select a collection and start editing.'
    if (source === 'fixedProducts') {
      placeholderText = 'Select some products and start editing.'
    }
    if (source === 'recommended') {
      placeholderText =
        'Recommended Product List must be used on a product page.'
    }

    return (
      <div ref={ref} {...rest}>
        <Placeholder element="Product List">{placeholderText}</Placeholder>
      </div>
    )
  }

  let totalProducts =
    source === 'fixedProducts' ? fixedProducts.length : productCount
  let rows = Math.ceil(totalProducts / productsPerRow)
  let shouldRenderSkeleton = ssrMode || !products.length
  let display = 'grid'
  let overflow = 'hidden'
  if (!shouldRenderSkeleton && layout === 'slider') {
    display = 'block'
    overflow = '0'
  }
  let style = {
    '--display': display,
    '--overflow': overflow,
    '--gap': `${gap}px`,
    '--product-per-row': productsPerRow,
    '--rows': rows,
  } as React.CSSProperties

  if (shouldRenderSkeleton) {
    return (
      <div ref={ref} {...rest} style={style}>
        <Skeleton
          productCount={layout === 'slider' ? productsPerRow : productCount}
          imageAspectRatio={imageAspectRatio}
        />
      </div>
    )
  }

  let productCards = products
    .filter((p) => p && p.id !== mainProductId)
    .slice(0, productCount)
    .map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        imageAspectRatio={imageAspectRatio}
        showSecondImageOnHover={showSecondImageOnHover}
        showSaleBadge={showSaleBadge}
        showViewDetailsButton={showViewDetailsButton}
        viewDetailsButtonText={viewDetailsButtonText}
        showQuickViewButton={showQuickViewButton}
        showProductOption={showProductOption}
        optionName={optionName}
        optionLimit={optionLimit}
        className={layout === 'slider' ? 'keen-slider__slide' : ''}
      />
    ))

  if (layout === 'slider') {
    return (
      <div ref={ref} {...rest} style={style}>
        <Slider className="wv-product-list__slider" gap={gap}>
          {productCards}
        </Slider>
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
  showProductOption: true,
  optionName: 'Color',
  optionLimit: 4,
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'var(--display, grid)',
    gridTemplateColumns: 'repeat(var(--product-per-row), 1fr)',
    gap: 'var(--gap, 16px)',
    overflow: 'var(--overflow, hidden)',
    position: 'relative',
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
    '.wv-product-list__slider': {
      '.wv-product-card': {
        padding: '0 32px',
      },
    },
    ...productCardCss['@mobile'],
    ...skeletonCss['@mobile'],
  },
}
