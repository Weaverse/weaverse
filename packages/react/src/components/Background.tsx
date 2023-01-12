import { styled } from '@stitches/react'
import type { CSSProperties } from 'react'
import React from 'react'
import type { BackgroundProps } from '~/types'

export function Background(props: BackgroundProps) {
  let {
    backgroundColor,
    backgroundImage,
    backgroundFit,
    backgroundPosition,
    className,
  } = props
  let style = {
    ['--bg-color']: backgroundColor,
    ['--bg-fit']: backgroundFit,
    ['--bg-position']: backgroundPosition,
  } as CSSProperties

  if (backgroundImage || backgroundColor) {
    return (
      <StyledBackground style={style} className={className}>
        {backgroundImage && (
          <img
            width="100%"
            height="100%"
            data-blink-src={backgroundImage}
            alt="Background"
          />
        )}
      </StyledBackground>
    )
  }
  return null
}

export let StyledBackground = styled('div', {
  display: 'block !important',
  position: 'absolute',
  inset: 0,
  backgroundColor: 'var(--bg-color)',
  img: {
    objectFit: 'var(--bg-fit, cover)',
    objectPosition: 'var(--bg-position, 50% 50%)',
  },
})
