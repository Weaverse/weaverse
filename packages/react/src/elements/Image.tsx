import type { ElementCSS } from '@weaverse/core'
import React from 'react'
import type { ImageElementProps } from '~/types'

let Image = React.forwardRef<HTMLDivElement, ImageElementProps>(
  (props, ref) => {
    let {
      src,
      alt,
      objectFit,
      objectPosition,
      clickAction,
      openLinkInNewTab,
      linkTo,
      ...rest
    } = props

    let style = {
      '--img-object-fit': objectFit,
      '--img-object-position': objectPosition,
    } as React.CSSProperties

    let content = <img alt={alt} data-blink-src={src} />
    if (clickAction === 'openLink' && linkTo) {
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

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    overflow: 'hidden',
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'var(--img-object-fit, cover)',
      objectPosition: 'var(--img-object-position, center)',
      '&[data-blink-src]': {
        visibility: 'hidden',
      },
    },
  },
}

Image.defaultProps = {
  src: 'https://ucarecdn.com/cf54e41e-36a0-4547-a140-a302e0387890/',
  alt: 'Image alt text',
  objectFit: 'cover',
  objectPosition: 'center',
  clickAction: 'none',
  openLinkInNewTab: false,
  linkTo: '',
}

export default Image
