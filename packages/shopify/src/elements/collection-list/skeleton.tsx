import type { ElementCSS } from '@weaverse/react'

import { Components } from '~/components'
import type { CollectionSkeletonProps } from '~/types'

let { Icon } = Components

export function Skeleton(props: CollectionSkeletonProps) {
  let { collectionCount, imageAspectRatio } = props
  let aspectRatio = imageAspectRatio === 'auto' ? '1/1' : imageAspectRatio
  let style = {
    '--image-aspect-ratio': aspectRatio,
  } as React.CSSProperties

  return (
    <>
      {Array.from({ length: collectionCount }).map((_, index) => (
        <div
          className="wv-col-card-skeleton animate-pulse"
          key={index}
          style={style}
        >
          <div className="wv-col-card-skeleton__image">
            <Icon name="Storefront" />
          </div>
          <div className="wv-col-card-skeleton__title" />
          <div className="wv-col-card-skeleton__items-count" />
        </div>
      ))}
    </>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-col-card-skeleton': {
      display: 'block',
      width: '100%',
      padding: '16px',
      '.wv-col-card-skeleton__image': {
        aspectRatio: 'var(--image-aspect-ratio, auto)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        svg: { width: '48px', height: '48px', color: '#FFFFFF' },
      },
      '.wv-col-card-skeleton__title': {
        display: 'block',
        height: '20px',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        margin: '12px 0',
        width: '80%',
      },
      '.wv-col-card-skeleton__items-count': {
        margin: '12px 0',
        height: '12px',
        display: 'block',
        backgroundColor: '#D1D5DB',
        borderRadius: '2px',
        width: '30%',
      },
    },
  },
  '@mobile': {
    '.wv-col-card-skeleton': {
      textDecoration: 'none',
      width: '80vw',
      scrollSnapAlign: 'start',
      flex: '0 0 auto',
      padding: '8px',
    },
  },
}
