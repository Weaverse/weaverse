import React from 'react'
import type { ImageElementProps } from '~/types'
import { isBrowser } from '@weaverse/core'
let PREVIEW_MODIFIER = '-/preview/-/quality/smart/-/format/auto/'
export function isUploadCareCdnUrl(url: string) {
  return !!url.match(/^https:\/\/ucarecdn\.com\/([a-z0-9-]{36})\//)
}

function optimizeImage(url: string) {
  if (!isUploadCareCdnUrl(url)) return url
  return url.includes('-/preview/') ? url : `${url}${PREVIEW_MODIFIER}`
}

let loadUploadCareAdaptiveDelivery = () => {
  if (!window.Blinkloader) {
    console.log('loadUploadCareAdaptiveDelivery')
    ;(function (src, cb) {
      let s = document.createElement('script')
      s.setAttribute('src', src)
      s.onload = cb
      ;(document.head || document.body).appendChild(s)
    })(
      'https://ucarecdn.com/libs/blinkloader/3.x/blinkloader.min.js',
      function () {
        window.Blinkloader.optimize({
          pubkey: '1a22133d1a1bdc089d4c',
          fadeIn: true,
          lazyload: true,
          smartCompression: true,
          responsive: true,
          retina: true,
          webp: true,
        })
      }
    )
  }
}
if (isBrowser) {
  loadUploadCareAdaptiveDelivery()
}

let Image = React.forwardRef<HTMLDivElement, ImageElementProps>(
  (props, ref) => {
    let {
      src,
      alt,
      objectFit,
      objectPosition,
      onClickAction,
      openLinkInNewTab,
      linkTo,
      ...rest
    } = props

    let style = {
      '--wv-img-object-fit': objectFit,
      '--wv-img-object-position': objectPosition,
    } as React.CSSProperties

    let content = <img alt={alt} data-blink-src={src} />
    if (onClickAction === 'open-link' && linkTo) {
      let target = openLinkInNewTab ? '_blank' : '_self'
      content = (
        <a href={linkTo} target={target}>
          {content}
        </a>
      )
    }
    return (
      <div ref={ref} {...rest} style={style}>
        {content}
      </div>
    )
  }
)

export let css = {
  '@desktop': {
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'var(--wv-img-object-fit, cover)',
      objectPosition: 'var(--wv-img-object-position, center)',
    },
    '> [data-blink-src]': {
      visibility: 'hidden',
    },
  },
}

Image.defaultProps = {
  src: 'https://ucarecdn.com/c413b8fe-ceec-4948-9c42-a0434c4ca920/',
  alt: 'Image alt text',
  objectFit: 'cover',
  objectPosition: 'center',
  onClickAction: 'open-link',
  openLinkInNewTab: false,
  linkTo: '',
}

export default Image
