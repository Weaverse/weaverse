import type { ElementCSS } from '@weaverse/react'

import { forwardRef } from 'react'
import { Components } from '~/components'
import { useWeaverseShopify } from '~/hooks/use-weaverse-shopify'
import type { ProductListProps } from '~/types'
import { ProductCard, css as productCardCss } from './product-card'
import { Skeleton, css as skeletonCss } from './skeleton'
import { useProducts } from './use-products'

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
  let { ssrMode, isDesignMode } = useWeaverseShopify()
  let products = useProducts({
    source,
    collectionId,
    fixedProducts,
    isDesignMode,
  })

  let mainProductId = 0
  if (!(ssrMode || isDesignMode)) {
    mainProductId = window.weaverseShopifyConfigs.shopData.product_id
  }
  let shouldShowPlaceholder =
    (source === 'collection' && !collectionId) ||
    (source === 'fixedProducts' && !fixedProducts?.length) ||
    (source === 'recommended' && !ssrMode && !isDesignMode && !mainProductId)

  if (shouldShowPlaceholder) {
    let placeholderText = 'Select a collection and start editing.'
    if (source === 'fixedProducts') {
      placeholderText = 'Select products and start editing.'
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
          imageAspectRatio={imageAspectRatio}
          productCount={layout === 'slider' ? productsPerRow : productCount}
        />
      </div>
    )
  }

  let productCards = products
    .filter((p) => p && p.id !== mainProductId)
    .slice(0, productCount)
    .map((product) => (
      <ProductCard
        className={layout === 'slider' ? 'keen-slider__slide' : ''}
        imageAspectRatio={imageAspectRatio}
        key={product.id}
        optionLimit={optionLimit}
        optionName={optionName}
        product={product}
        showProductOption={showProductOption}
        showQuickViewButton={showQuickViewButton}
        showSaleBadge={showSaleBadge}
        showSecondImageOnHover={showSecondImageOnHover}
        showViewDetailsButton={showViewDetailsButton}
        viewDetailsButtonText={viewDetailsButtonText}
      />
    ))

  if (layout === 'slider') {
    return (
      <div ref={ref} {...rest} style={style}>
        <Slider
          arrowOffset={-80}
          className="wv-product-list__slider"
          gap={gap}
          slidesPerView={productsPerRow}
        >
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
