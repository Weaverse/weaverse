import type { ElementCSS } from '@weaverse/react'
import React from 'react'

import type { ImageElementProps } from '~/types/components'

let Image = React.forwardRef<HTMLDivElement, ImageElementProps>(
  (props, ref) => {
    let {
      src,
      alt,
      objectFit,
      objectPosition,
      clickAction,
      openInNewTab,
      linkTo,
      ...rest
    } = props

    let style = {
      '--img-object-fit': objectFit,
      '--img-object-position': objectPosition,
    } as React.CSSProperties
    if (src?.includes('ucarecdn.com') && src?.endsWith('/')) {
      // add -/preview/-/quality/smart/-/format/auto/ if it ends with {uuid}/
      src = `${src}-/preview/-/quality/smart/-/format/auto/`
    }
    let content = <img alt={alt} src={src} loading="lazy" />
    if (clickAction === 'openLink' && linkTo) {
      content = (
        <a
          href={linkTo}
          target={openInNewTab ? '_blank' : '_self'}
          rel="noreferrer"
        >
          <img alt={alt} src={src} loading="lazy" />
        </a>
      )
    }

    return (
      <div ref={ref} {...rest} style={style}>
        {content}
      </div>
    )
  },
)

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'var(--img-object-fit, cover)',
      objectPosition: 'var(--img-object-position, center)',
    },
  },
}

Image.defaultProps = {
  src: 'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Integration.png?v=1698317519',
  alt: 'Alternative information',
  objectFit: 'cover',
  objectPosition: 'center center',
  clickAction: 'none',
  openInNewTab: false,
  linkTo: '',
}

export default Image
