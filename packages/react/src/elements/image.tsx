import React from 'react'
import type { ImageElementProps } from '~/types'

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

    let content = <img alt={alt} src={src} />
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
