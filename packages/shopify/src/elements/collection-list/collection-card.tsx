import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'
import React from 'react'
import type { CollectionCardProps } from '~/types'

export function CollectionCard(props: CollectionCardProps) {
  let {
    collection,
    imageAspectRatio,
    showProductCount,
    zoomInOnHover,
    className,
  } = props
  let { title, handle, products_count, image } = collection
  let style = {
    '--image-aspect-ratio':
      imageAspectRatio === 'auto' ? '1/1' || 'auto' : imageAspectRatio,
  } as React.CSSProperties

  let cardClass = clsx(
    'wv-collection-card',
    zoomInOnHover && 'zoom-in-on-hover',
    className
  )

  return (
    <div className={cardClass} style={style}>
      <div className="wv-col-card__image">
        <img
          srcSet={`
            ${image.src}&width=165 165w,
            ${image.src}&width=330 330w,
            ${image.src}&width=535 535w,
            ${image.src}&width=750 750w,
            ${image.src}&width=1000 1000w,
            ${image.src} 1200w
          `}
          src={`${image.src}&width=1500`}
          sizes="(min-width: 1200px) 366px, (min-width: 750px) calc((100vw - 10rem) / 2), calc(100vw - 3rem)"
          alt={image.alt || title}
          height="1600"
          width="1200"
          loading="lazy"
        />
      </div>
      <div className="wv-col-card__content">
        <h3 className="wv-col-card__title">
          <a href={`/collections/${handle}`} target="_self">
            {title}
          </a>
        </h3>
        {showProductCount && (
          <p className="wv-col-card__product-count">
            {products_count} products
          </p>
        )}
      </div>
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-collection-card': {
      textDecoration: 'none',
      padding: '16px',
      cursor: 'pointer',
      '.wv-col-card__image': {
        position: 'relative',
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        aspectRatio: 'var(--image-aspect-ratio, auto)',
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
          a: {
            fontWeight: 400,
            fontSize: '24px',
            lineHeight: '34px',
            color: '#000000',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
        '.wv-col-card__product-count': {
          fontSize: '15px',
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
