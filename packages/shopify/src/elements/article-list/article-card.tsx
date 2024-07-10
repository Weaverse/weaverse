import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'
import type React from 'react'

import type { ArticleCardProps } from '~/types'

export function ArticleCard(props: ArticleCardProps) {
  let {
    article,
    imageAspectRatio,
    zoomInOnHover,
    showDate,
    showAuthor,
    showExcerpt,
    excerptLineClamp,
    showReadMoreButton,
    readMoreButtonText,
    className,
  } = props
  let { title, excerpt, summary_html, author, published_at, image, url } =
    article
  let style = {
    '--image-aspect-ratio':
      imageAspectRatio === 'auto' ? '1/1' || 'auto' : imageAspectRatio,
  } as React.CSSProperties
  let cardClass = clsx(
    'wv-article-card',
    zoomInOnHover && 'zoom-in-on-hover',
    className,
  )
  let excerptStyle = {
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: excerptLineClamp,
  } as React.CSSProperties
  let imageSrc = typeof image === 'string' ? image : image?.src
  let imageAltText = typeof image === 'string' ? title : image?.alt || title
  let articleSummary = excerpt || summary_html

  return (
    <div className={cardClass} style={style}>
      <a href={url} target="_self">
        {image && (
          <div className="wv-article-card__image">
            <img
              srcSet={`
                ${imageSrc}&width=165 165w,
                ${imageSrc}&width=330 330w,
                ${imageSrc}&width=535 535w,
                ${imageSrc}&width=750 750w,
                ${imageSrc}&width=1000 1000w,
                ${imageSrc} 1200w
              `}
              src={`${imageSrc}&width=1500`}
              sizes="(min-width: 1200px) 366px, (min-width: 750px) calc((100vw - 10rem) / 2), calc(100vw - 3rem)"
              alt={imageAltText}
              height="1600"
              width="1200"
              loading="lazy"
            />
          </div>
        )}
        <div className="wv-article-card__content">
          <div className="wv-article-card__info">
            {showDate && (
              <div className="wv-article-card__date">{published_at}</div>
            )}
            {showAuthor && (
              <div className="wv-article-card__author">{author}</div>
            )}
          </div>
          <h3 className="wv-article-card__title">{title}</h3>
          {showExcerpt && articleSummary && (
            <div className="wv-article-card__excerpt" style={excerptStyle}>
              <div
                className="wv-article-card__excerpt-text"
                dangerouslySetInnerHTML={{ __html: articleSummary }}
              />
            </div>
          )}
        </div>
      </a>
      {showReadMoreButton && readMoreButtonText && (
        <a href={url} target="_self" className="wv-article-card__read-more">
          {readMoreButtonText}
        </a>
      )}
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-article-card': {
      textDecoration: 'none',
      padding: '16px',
      cursor: 'pointer',
      a: {
        textDecoration: 'none',
      },
      '.wv-article-card__image': {
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
          '.wv-article-card__image': {
            img: {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      '.wv-article-card__content': {
        marginTop: '20px',
        '.wv-article-card__info': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#363535',
        },
        '.wv-article-card__title': {
          margin: '12px 0px',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: '22px',
          color: '#222222',
          '&:hover': {
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          },
        },
        '.wv-article-card__excerpt': {
          overflow: 'hidden',
          display: '-webkit-box',
          marginTop: '8px',
          fontSize: '15px',
          lineHeight: '1.4',
          color: 'rgb(34, 34, 34, .75)',
        },
      },
      '.wv-article-card__read-more': {
        marginTop: '16px',
        position: 'relative',
        padding: '2px 0',
        height: 'auto',
        lineHeight: '1.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: '.3s all',
        background: 'none',
        color: '#222222',
        whiteSpace: 'nowrap',
        fontSize: '15px',
        fontWeight: '500',
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
        '&:hover': {
          color: '#222222c7',
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
