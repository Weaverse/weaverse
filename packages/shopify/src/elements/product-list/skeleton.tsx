import type { ElementCSS } from '@weaverse/react'
import { Components } from '~/components'
import React from 'react'
import type { ProductSkeletonProps } from '~/types'
let { Icon } = Components

export function Skeleton(props: ProductSkeletonProps) {
  let { productCount, imageAspectRatio } = props
  let aspectRatio = imageAspectRatio === 'auto' ? '1/1' : imageAspectRatio
  let style = {
    '--image-aspect-ratio': aspectRatio,
  } as React.CSSProperties

  return (
    <>
      {Array.from({ length: productCount }).map((_, index) => (
        <div
          key={index}
          className="wv-pcard-skeleton animate-pulse"
          style={style}
        >
          <div className="wv-pcard-skeleton__image">
            <Icon name="Backpack" />
          </div>
          <div className="wv-pcard-skeleton__price">
            <div className="wv-pcard-skeleton__price-value" />
            <div className="wv-pcard-skeleton__price-value" />
          </div>
          <div className="wv-pcard-skeleton__title" />
          <div className="wv-pcard-skeleton__options">
            <div className="wv-pcard-skeleton__option-value" />
            <div className="wv-pcard-skeleton__option-value" />
            <div className="wv-pcard-skeleton__option-value" />
            <div className="wv-pcard-skeleton__option-value" />
          </div>
        </div>
      ))}
    </>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-pcard-skeleton': {
      display: 'block',
      width: '100%',
      padding: '16px',
      '.wv-pcard-skeleton__image': {
        aspectRatio: 'var(--image-aspect-ratio, auto)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        svg: { width: '48px', height: '48px', color: '#FFFFFF' },
      },
      '.wv-pcard-skeleton__price': {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        margin: '16px 0',
        '.wv-pcard-skeleton__price-value': {
          display: 'block',
          height: '12px',
          backgroundColor: '#D1D5DB',
          borderRadius: '2px',
          width: '30%',
        },
      },
      '.wv-pcard-skeleton__title': {
        display: 'block',
        height: '20px',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        margin: '12px auto',
        width: '80%',
      },
      '.wv-pcard-skeleton__options': {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        margin: '12px 0',
        '.wv-pcard-skeleton__option-value': {
          display: 'block',
          height: '24px',
          width: '24px',
          backgroundColor: '#D1D5DB',
          borderRadius: '100%',
        },
      },
    },
  },
  '@mobile': {
    '.wv-pcard-skeleton': {
      textDecoration: 'none',
      width: '80vw',
      scrollSnapAlign: 'start',
      flex: '0 0 auto',
      padding: '8px',
    },
  },
}
