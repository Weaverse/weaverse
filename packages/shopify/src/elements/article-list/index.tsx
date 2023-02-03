import type { ElementCSS } from '@weaverse/react'
import { Components, WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import type { ArticleListProps } from '~/types'
import { ArticleCard, css as articleCardCss } from './article-card'
import { css as skeletonCss, Skeleton } from './skeleton'
let { Placeholder, Slider } = Components

let ArticleList = forwardRef<HTMLDivElement, ArticleListProps>((props, ref) => {
  let {
    blogId,
    blogHandle,
    layout,
    articleCount,
    articlesPerRow,
    gap,
    imageAspectRatio,
    showFeaturedImage,
    showDate,
    showAuthor,
    showExcerpt,
    excerptLineClamp,
    showTags,
    children,
    ...rest
  } = props
  let { ssrMode } = useContext(WeaverseContext)
  let articles = window.weaverseShopifyBlogs?.[blogId] || []

  if (!blogId) {
    return (
      <div ref={ref} {...rest}>
        <Placeholder element="Article List">
          Select a blog and start editing.
        </Placeholder>
      </div>
    )
  }

  let rows = Math.ceil(articles.length / articlesPerRow)
  let shouldRenderSkeleton = ssrMode || !articles.length
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
    '--article-per-row': articlesPerRow,
    '--rows': rows,
  } as React.CSSProperties

  if (shouldRenderSkeleton) {
    return (
      <div ref={ref} {...rest} style={style}>
        <Skeleton
          articleCount={layout === 'slider' ? articlesPerRow : articleCount}
          imageAspectRatio={imageAspectRatio}
        />
      </div>
    )
  }

  let collectionCards = articles
    .slice(0, articleCount)
    .map((article) => (
      <ArticleCard
        key={article.id}
        article={article}
        imageAspectRatio={imageAspectRatio}
        showFeaturedImage={showFeaturedImage}
        showAuthor={showAuthor}
        showDate={showDate}
        showExcerpt={showExcerpt}
        excerptLineClamp={excerptLineClamp}
        showTags={showTags}
        className={layout === 'slider' ? 'keen-slider__slide' : ''}
      />
    ))

  if (layout === 'slider') {
    return (
      <div ref={ref} {...rest} style={style}>
        <Slider
          className="wv-article-list__slider"
          gap={gap}
          arrowOffset={-80}
          slidesPerView={articlesPerRow}
        >
          {collectionCards}
        </Slider>
      </div>
    )
  }

  return (
    <div ref={ref} {...rest} style={style}>
      {collectionCards}
    </div>
  )
})

export default ArticleList

ArticleList.defaultProps = {
  layout: 'grid',
  articleCount: 4,
  articlesPerRow: 4,
  gap: 16,
  imageAspectRatio: 'auto',
  showFeaturedImage: true,
  showDate: true,
  showAuthor: true,
  showTags: true,
  showExcerpt: true,
  excerptLineClamp: 3,
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'var(--display, grid)',
    gridTemplateColumns: 'repeat(var(--article-per-row), 1fr)',
    gap: 'var(--gap, 16px)',
    overflow: 'var(--overflow, hidden)',
    position: 'relative',
    ...articleCardCss['@desktop'],
    ...skeletonCss['@desktop'],
  },
  '@mobile': {
    display: 'flex',
    overflow: 'auto',
    scrollBehavior: 'smooth',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 0,
    '.wv-article-list__slider': {
      '.wv-article-card': {
        padding: '0 32px',
      },
    },
    ...articleCardCss['@mobile'],
    ...skeletonCss['@mobile'],
  },
}
