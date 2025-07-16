import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'

import type { CollectionCardProps } from '~/types'

export function CollectionCard(props: CollectionCardProps) {
  let {
    collection,
    imageAspectRatio,
    showProductCount,
    zoomInOnHover,
    className,
  } = props
  let { title, products_count, featured_image, url } = collection
  let style = {
    '--image-aspect-ratio':
      imageAspectRatio === 'auto' ? '1/1' || 'auto' : imageAspectRatio,
  } as React.CSSProperties
  let cardClass = clsx(
    'wv-collection-card',
    zoomInOnHover && 'zoom-in-on-hover',
    className
  )
  let imageSrc =
    typeof featured_image === 'string' ? featured_image : featured_image?.src
  let imageAltText =
    typeof featured_image === 'string' ? title : featured_image?.alt || title

  return (
    <div className={cardClass} style={style}>
      <a href={url} target="_self">
        {featured_image && (
          <div className="wv-col-card__image">
            <img
              alt={imageAltText}
              height="1600"
              loading="lazy"
              sizes="(min-width: 1200px) 366px, (min-width: 750px) calc((100vw - 10rem) / 2), calc(100vw - 3rem)"
              src={`${imageSrc}&width=1500`}
              srcSet={`
            ${imageSrc}&width=165 165w,
            ${imageSrc}&width=330 330w,
            ${imageSrc}&width=535 535w,
            ${imageSrc}&width=750 750w,
            ${imageSrc}&width=1000 1000w,
            ${imageSrc} 1200w
          `}
              width="1200"
            />
          </div>
        )}
        <div className="wv-col-card__content">
          <h3 className="wv-col-card__title">{title}</h3>
          {showProductCount && (
            <p className="wv-col-card__product-count">
              {products_count} products
            </p>
          )}
        </div>
      </a>
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-collection-card': {
      a: {
        textDecoration: 'none',
      },
      padding: '16px',
      cursor: 'pointer',
      '.wv-col-card__image': {
        position: 'relative',
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        aspectRatio: 'var(--image-aspect-ratio, auto)',
        borderRadius: '6px',
        img: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        },
      },
      '&.zoom-in-on-hover': {
        '&:hover': {
          '.wv-col-card__image': {
            img: {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      '.wv-col-card__content': {
        marginTop: '20px',
        '.wv-col-card__title': {
          marginTop: 0,
          marginBottom: '2px',
          fontWeight: 400,
          fontSize: '24px',
          lineHeight: '34px',
          color: '#000000',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '.wv-col-card__product-count': {
          fontSize: '16px',
          color: '#666666',
          margin: 0,
        },
      },
    },
  },
  '@mobile': {
    '.wv-collection-card': {
      textDecoration: 'none',
      width: '80vw',
      scrollSnapAlign: 'start',
      flex: '0 0 auto',
      padding: '8px',
    },
  },
}
