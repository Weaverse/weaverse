import type { ElementCSS } from '@weaverse/react'

import { Components } from '~/components'
import type { ArticleSkeletonProps } from '~/types'

let { Icon } = Components

export function Skeleton(props: ArticleSkeletonProps) {
  let { articleCount, imageAspectRatio } = props
  let aspectRatio = imageAspectRatio === 'auto' ? '1/1' : imageAspectRatio
  let style = {
    '--image-aspect-ratio': aspectRatio,
  } as React.CSSProperties

  return (
    <>
      {Array.from({ length: articleCount }).map((_, index) => (
        <div
          key={index}
          className="wv-article-card-skeleton animate-pulse"
          style={style}
        >
          <div className="wv-article-card-skeleton__image">
            <Icon name="Newspaper" />
          </div>
          <div className="wv-article-card__info">
            <div className="wv-article-card__date" />
            <div className="wv-article-card__author" />
          </div>
          <div className="wv-article-card-skeleton__title" />
          <div className="wv-article-card__readmore" />
        </div>
      ))}
    </>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-article-card-skeleton': {
      display: 'block',
      width: '100%',
      padding: '16px',
      '.wv-article-card-skeleton__image': {
        aspectRatio: 'var(--image-aspect-ratio, auto)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        svg: { width: '48px', height: '48px', color: '#FFFFFF' },
      },
      '.wv-article-card__info': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '12px 0',
        '.wv-article-card__date, .wv-article-card__author': {
          height: '12px',
          display: 'block',
          backgroundColor: '#D1D5DB',
          borderRadius: '2px',
          width: '30%',
        },
      },
      '.wv-article-card-skeleton__title': {
        display: 'block',
        height: '20px',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        margin: '12px 0',
      },
      '.wv-article-card__readmore': {
        display: 'block',
        height: '20px',
        backgroundColor: '#D1D5DB',
        borderRadius: '4px',
        margin: '16px 0',
        width: '40%',
      },
    },
  },
  '@mobile': {
    '.wv-article-card-skeleton': {
      textDecoration: 'none',
      width: '80vw',
      scrollSnapAlign: 'start',
      flex: '0 0 auto',
      padding: '8px',
    },
  },
}
