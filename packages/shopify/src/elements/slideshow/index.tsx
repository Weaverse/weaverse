import { css as stitchesCss } from '@stitches/react'
import type { ElementCSS } from '@weaverse/core'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Arrows } from '~/components/slider/arrows'
import { Dots } from '~/components/slider/dots'
import type { SlideshowProps } from '~/types/components'
import { useSlideshowConfigs } from './use-slideshow-configs'

let Slideshow = forwardRef<HTMLDivElement, SlideshowProps>((props, ref) => {
  let {
    animation,
    showArrows,
    showArrowsOnHover,
    arrowIcon,
    arrowsColor,
    showDots,
    dotsPosition,
    dotsColor,
    children,
    ...rest
  } = props
  let { sliderRef, instanceRef, currentSlide, opacities, ready, created } =
    useSlideshowConfigs(props)

  // must put style after rest props, to override default style
  let style = {
    '--slider-opacity': ready ? 1 : 0,
  } as React.CSSProperties
  let faderClass = ''
  if (animation === 'fade') {
    faderClass = stitchesCss({
      '.keen-slider__slide': opacities.reduce<
        Record<string, { opacity: number; display: string }>
      >((acc, opacity, index) => {
        acc[`&:nth-child(${index + 1})`] = {
          opacity,
          display: opacity === 0 ? 'none' : 'block',
        }

        return acc
      }, {}),
    })().className
  }

  let _className = clsx(
    faderClass,
    animation === 'slide' ? 'keen-slider' : 'keen-fader',
  )
  let arrowsClass = clsx(
    'wv-slideshow--arrows',
    showArrowsOnHover && 'show-on-hover',
    `arrows--${arrowsColor}`,
  )

  return (
    <div ref={ref} {...rest} style={style}>
      <div ref={sliderRef} className={_className}>
        {children}
      </div>
      {showArrows && created && instanceRef?.current && (
        <Arrows
          instanceRef={instanceRef}
          currentSlide={currentSlide}
          className={arrowsClass}
          icon={arrowIcon}
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
    '.wv-slideshow--arrows': {
      '.arrow': {
        borderRadius: '100%',
        backgroundColor: 'transparent',
        padding: '6px',
        '&:hover': {
          backgroundColor: '#fff',
        },
        svg: {
          width: '28px',
          height: '28px',
        },
      },
      '&.show-on-hover': {
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&.arrows--dark': {
        '.arrow': {
          color: '#000',
        },
      },
      '&.arrows--light': {
        '.arrow': {
          color: '#fff',
        },
      },
    },
    '&:hover': {
      '.wv-slideshow--arrows': {
        opacity: 1,
      },
    },
  },
}

Slideshow.defaultProps = {
  animation: 'slide',
  slidesPerView: 1,
  spacing: 0,
  showArrows: true,
  showArrowsOnHover: false,
  arrowIcon: 'caret',
  arrowsColor: 'dark',
  showDots: true,
  dotsPosition: 'bottom',
  dotsColor: 'dark',
  loop: true,
  autoRotate: false,
  changeSlidesEvery: 5,
}

export default Slideshow
