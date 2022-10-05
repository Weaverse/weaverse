import React, { useContext } from 'react'
import { WeaverseContext } from '~/context'
import type { ImageElementProps } from '~/types'
let PREVIEW_MODIFIER = '-/preview/-/quality/smart/-/format/auto/'
export function isUploadCareCdnUrl(url: string) {
  return !!url.match(/^https:\/\/ucarecdn\.com\/([a-z0-9-]{36})\//)
}

function optimizeImage(url: string) {
  if (!isUploadCareCdnUrl(url)) return url
  return url.includes('-/preview/') ? url : `${url}${PREVIEW_MODIFIER}`
}
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
        <img alt={alt} src={optimizeImage(src)} />
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
  src: 'https://ucarecdn.com/c413b8fe-ceec-4948-9c42-a0434c4ca920/-/preview/-/quality/smart/-/format/auto/',
  alt: 'Image alt text',
  objectFit: 'cover',
  objectPosition: 'center',
  onClickAction: 'open-lightbox',
  openLinkInNewTab: false,
}

export default Image
