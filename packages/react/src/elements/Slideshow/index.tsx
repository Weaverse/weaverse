import { css as stitchesCss } from '@stitches/react'
import type { ElementCSS } from '@weaverse/core'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Arrows } from '~/components/_slider/_arrows'
import { Dots } from '~/components/_slider/_dots'
import type { SlideshowProps } from '~/types'
import { useSlideshowConfigs } from './useSlideshowConfigs'

let Slideshow = forwardRef<HTMLDivElement, SlideshowProps>((props, ref) => {
  let {
    animation,
    showArrows,
    showDots,
    dotsPosition,
    dotsColor,
    children,
    ...rest
  } = props
  let { sliderRef, instanceRef, currentSlide, opacities, ready, created } =
    useSlideshowConfigs(props)

  let style = {
    '--slider-opacity': ready ? 1 : 0,
  } as React.CSSProperties
  let faderClass = ''
  if (animation === 'fade') {
    faderClass = stitchesCss({
      '.keen-slider__slide': opacities.reduce<
        Record<string, { opacity: number }>
      >((acc, opacity, index) => {
        acc[`&:nth-child(${index + 1})`] = {
          opacity,
        }
        return acc
      }, {}),
    })().className
  }
  let _className = clsx(
    faderClass,
    animation === 'slide' ? 'keen-slider' : 'keen-fader'
  )

  return (
    <div ref={ref} style={style} {...rest}>
      <div ref={sliderRef} className={_className}>
        {children}
      </div>
      {showArrows && created && instanceRef?.current && (
        <Arrows
          instanceRef={instanceRef}
          currentSlide={currentSlide}
          className="wv-slideshow--arrows"
          offset={20}
        />
      )}
      {showDots && created && instanceRef?.current && (
        <Dots
          instanceRef={instanceRef}
          currentSlide={currentSlide}
          className="wv-slideshow--dots"
          position={dotsPosition}
          color={dotsColor}
          absolute
        />
      )}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    opacity: 'var(--slider-opacity, 0)',
    padding: '32px 0',
    position: 'relative',
    '.keen-slider': {
      height: '100%',
    },
    '.keen-fader': {
      position: 'relative',
      height: '100%',
      '.keen-slider__slide': {
        position: 'absolute',
        inset: 0,
      },
    },
  },
}

Slideshow.defaultProps = {
  animation: 'slide',
  slidesPerView: 1,
  spacing: 0,
  showArrows: true,
  showDots: true,
  dotsPosition: 'bottom',
  dotsColor: 'light',
  loop: true,
  autoRotate: false,
  changeSlidesEvery: 5,
}

export default Slideshow
