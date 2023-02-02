import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'
import React from 'react'
import type { ArticleCardProps } from '~/types'

export function ArticleCard(props: ArticleCardProps) {
  let {
    article,
    imageAspectRatio,
    showFeaturedImage,
    showDate,
    showAuthor,
    showExcerpt,
    excerptLineClamp,
    showTags,
    className,
  } = props
  let { title, handle, tags, summary_html, author, created_at, image } = article
  let style = {
    '--image-aspect-ratio':
      imageAspectRatio === 'auto' ? '1/1' || 'auto' : imageAspectRatio,
  } as React.CSSProperties

  let cardClass = clsx('wv-article-card', className)
  let excerptStyle = {
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: excerptLineClamp,
  } as React.CSSProperties

  return (
    <div className={cardClass} style={style}>
      {showFeaturedImage && image && (
        <div className="wv-article-card__image">
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
      )}
      <div className="wv-article-card__content">
        <div className="wv-article-card__info">
          {showDate && (
            <div className="wv-article-card__date">
              {new Date(created_at).toLocaleDateString()}
            </div>
          )}
          {showAuthor && (
            <div className="wv-article-card__author">{author}</div>
          )}
        </div>
        <h3 className="wv-article-card__title">
          <a href={`/blogs/blog-handle/${handle}`} target="_self">
            {title}
          </a>
        </h3>
        {showExcerpt && summary_html && (
          <div className="wv-article-card__excerpt" style={excerptStyle}>
            <div
              className="wv-article-card__excerpt-text"
              dangerouslySetInnerHTML={{ __html: summary_html }}
            />
          </div>
        )}
        {showTags && tags && (
          <div className="wv-article-card__tags">
            {tags.split(',').map((tag) => (
              <a
                key={tag}
                href={`/blogs/blog-handle?tag=${tag.trim()}`}
                target="_self"
                className="wv-article-card__tag"
              >
                {tag.trim()}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-article-card': {
      textDecoration: 'none',
      padding: '16px',
      cursor: 'pointer',
      '.wv-article-card__image': {
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
          '.wv-article-card__image': {
            img: {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      '.wv-article-card__content': {
        marginTop: '20px',
        '.wv-article-card__title': {
          marginTop: '8px',
          a: {
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '22px',
            color: '#222222',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            },
          },
        },
        '.wv-article-card__info': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: 'rgb(34, 34, 34)',
        },
        '.wv-article-card__excerpt': {
          overflow: 'hidden',
          display: '-webkit-box',
          marginTop: '8px',
          fontSize: '15px',
          color: 'rgb(34, 34, 34, .75)',
        },
      },
    },
  },
  '@mobile': {
    '.wv-article-card': {
      textDecoration: 'none',
      width: '80vw',
      scrollSnapAlign: 'start',
      flex: '0 0 auto',
      padding: '8px',
    },
  },
}
