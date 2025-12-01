import type { CSSProperties } from 'react'

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
      <div className={className} style={style}>
        {backgroundImage && (
          <img
            alt="Background"
            height="100%"
            loading="lazy"
            src={
              typeof backgroundImage === 'object'
                ? backgroundImage.url
                : backgroundImage
            }
            style={{
              objectFit: backgroundFit,
              objectPosition: backgroundPosition,
            }}
            width="100%"
          />
        )}
      </div>
    )
  }
  return null
}
