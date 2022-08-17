import React, { useContext } from 'react'
import { WeaverseContext } from '../context'
import type { ImageElementProps } from '../types'

let Image = React.forwardRef<HTMLDivElement, ImageElementProps>(
  (props, ref) => {
    let { isDesignMode } = useContext(WeaverseContext)
    let {
      src,
      alt,
      objectFit,
      objectPosition,
      onClickAction,
      openLinkInNewTab,
      ...rest
    } = props

    let style = {
      '--wv-img-object-fit': objectFit,
      '--wv-img-object-position': objectPosition,
    } as React.CSSProperties

    let handleClick = () => {
      if (isDesignMode) {
        return console.log('Click action:', onClickAction)
      }
      if (onClickAction) {
        console.log('TODO: click action:', onClickAction)
      }
    }
    return (
      <div ref={ref} {...rest} style={style} onClick={handleClick}>
        <img alt={alt} src={src} />
      </div>
    )
  }
)

Image.defaultProps = {
  src: 'https://ucarecdn.com/c413b8fe-ceec-4948-9c42-a0434c4ca920/',
  alt: 'Image alt text',
  objectFit: 'cover',
  objectPosition: 'center',
  onClickAction: 'open-lightbox',
  openLinkInNewTab: false,
  css: {
    '@desktop': {
      img: {
        width: '100%',
        height: '100%',
        objectFit: 'var(--wv-img-object-fit, cover)',
        objectPosition: 'var(--wv-img-object-position, center)',
      },
    },
  },
}

export default Image
