import type { CSSProperties } from 'react'
import React from 'react'

import type { BackgroundProps } from '~/types/components'

export function Background(props: BackgroundProps) {
  let {
    backgroundColor,
    backgroundImage,
    backgroundFit,
    backgroundPosition,
    className,
  } = props
  let style = {
    display: 'block',
    position: 'absolute',
    inset: 0,
    backgroundColor,
  } as CSSProperties

  if (backgroundImage || backgroundColor) {
    return (
      <div style={style} className={className}>
        {backgroundImage && (
          <img
            width="100%"
            height="100%"
            src={
              typeof backgroundImage === 'object'
                ? backgroundImage.url
                : backgroundImage
            }
            loading="lazy"
            alt="Background"
            style={{
              objectFit: backgroundFit,
              objectPosition: backgroundPosition,
            }}
          />
        )}
      </div>
    )
  }
  return null
}
