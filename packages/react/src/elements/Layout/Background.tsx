import type { CSSProperties } from 'react'
import React from 'react'
import type { LayoutBackgroundProps } from '~/types'

export function Background(props: LayoutBackgroundProps) {
  let { bgColor, imgUrl, objectFit } = props
  let style = {
    ['--layout-bg-color']: bgColor,
    ['--layout-bg-image-object-fit']: objectFit,
  } as CSSProperties

  if (imgUrl || bgColor) {
    return (
      <div style={style} className="wv-layout-background">
        {imgUrl && (
          <img
            width="100%"
            height="100%"
            data-blink-src={imgUrl}
            alt="Section background"
          />
        )}
      </div>
    )
  }
  return null
}
