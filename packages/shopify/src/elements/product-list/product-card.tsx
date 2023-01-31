import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'
import React from 'react'
import { Image } from '~/elements/product/product-media/image'
import type { ProductCardProps } from '~/types'
import {
  css as productCardButtonsCss,
  ProductCardButtons,
} from './product-card-buttons'
import { css as productCardInfoCss, ProductCardInfo } from './product-card-info'
import {
  css as productCardSaleBadgeCss,
  ProductCardSaleBadge,
} from './product-card-sale-badge'

export function ProductCard(props: ProductCardProps) {
  let {
    product,
    imageAspectRatio,
    showSecondImageOnHover,
    showSaleBadge,
    showViewDetailsButton,
    viewDetailsButtonText,
    showQuickViewButton,
    showProductOption,
    optionName,
    optionLimit,
    className,
  } = props
  let { images, media, compare_at_price, aspect_ratio, url } = product
  let style = {
    '--image-aspect-ratio':
      imageAspectRatio === 'auto' ? aspect_ratio || 'auto' : imageAspectRatio,
  } as React.CSSProperties

  let isRecommendedProduct = Array.isArray(media)
  let imageSource = isRecommendedProduct ? media! : images
  let mainImage = imageSource[0]
  let secondImage = imageSource[1]
  let imagesClass = clsx(
    'wv-pcard__images',
    showSecondImageOnHover && secondImage && 'show-second-image-on-hover'
  )
  let cardClass = clsx('wv-product-card', className)

  return (
    <div className={cardClass} style={style}>
      <div className={imagesClass}>
        {mainImage ? (
          <>
            <a href={url} target="_self">
              <Image
                className="pcard-image main-image"
                image={mainImage}
                width={500}
              />
              {showSecondImageOnHover && secondImage ? (
                <Image
                  className="pcard-image secondary-image"
                  image={secondImage}
                  width={500}
                />
              ) : null}
            </a>
            <ProductCardButtons
              showViewDetailsButton={showViewDetailsButton}
              viewDetailsButtonText={viewDetailsButtonText}
              showQuickViewButton={showQuickViewButton}
              product={product}
            />
            {showSaleBadge && compare_at_price && <ProductCardSaleBadge />}
          </>
        ) : null}
      </div>
      <ProductCardInfo
        product={product}
        showProductOption={showProductOption}
        optionName={optionName}
        optionLimit={optionLimit}
      />
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-product-card': {
      textDecoration: 'none',
      padding: '16px',
      '.wv-pcard__images': {
        position: 'relative',
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        aspectRatio: 'var(--image-aspect-ratio, auto)',
        ...productCardSaleBadgeCss['@desktop'],
        '.pcard-image': {
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          objectFit: 'cover',
          '&.main-image': {
            transition: 'opacity 1s ease',
            opacity: 1,
          },
          '&.secondary-image': {
            position: 'absolute',
            inset: 0,
            opacity: 0,
            visibility: 'hidden',
            transform: 'scale3d(1.08, 1.08, 1)',
            transition: '.75s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
        '&.show-second-image-on-hover': {
          '&:hover': {
            '.main-image': {
              opacity: 0,
            },
            '.secondary-image': {
              opacity: 1,
              visibility: 'visible',
              transform: 'scale3d(1, 1, 1)',
            },
          },
        },
        ...productCardButtonsCss['@desktop'],
        '&:hover': {
          '.wv-pcard__buttons': {
            opacity: 1,
            transform: 'translate3d(-50%, 0, 0)',
          },
        },
      },
      ...productCardInfoCss['@desktop'],
    },
  },
  '@mobile': {
    '.wv-product-card': {
      textDecoration: 'none',
      width: '66vw',
      scrollSnapAlign: 'start',
      flex: '0 0 auto',
      padding: '8px',
    },
  },
}
