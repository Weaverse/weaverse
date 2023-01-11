import { css as stitchesCss } from '@stitches/react'
import type { ElementCSS } from '@weaverse/core'
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { Arrows } from '~/components/Slider/Arrows'
import { Dots } from '~/components/Slider/Dots'
import { ResizePlugin } from '~/components/Slider/ResizePlugin'
import { WeaverseContext } from '~/context'
import type { SlideshowProps } from '~/types'
import { loadCSS } from '~/utils/css'

let Slideshow = forwardRef<HTMLDivElement, SlideshowProps>((props, ref) => {
  let {
    animation,
    slidesPerView,
    spacing,
    showArrows,
    showDots,
    dotsPosition,
    dotsColor,
    loop,
    autoRotate,
    changeSlidesEvery,
    children,
    ...rest
  } = props
  let { isDesignMode } = useContext(WeaverseContext)
  let [opacities, setOpacities] = React.useState<number[]>([])
  let [cssLoaded, setCssLoaded] = useState(false)
  let [created, setCreated] = useState(false)
  let [ready, setReady] = useState(false)
  let [currentSlide, setCurrentSlide] = useState(0)
  let [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slides:
        animation === 'fade'
          ? React.Children.count(children)
          : { perView: slidesPerView },
      drag: !isDesignMode,
      loop,
      selector: animation === 'fade' ? null : '.keen-slider__slide',
      created: () => {
        setCreated(true)
      },
      slideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel)
      },
      detailsChanged: (slider) => {
        let newOpacities = slider.track?.details?.slides?.map(
          (slide) => slide.portion
        )
        setOpacities(newOpacities)
      },
    },
    [ResizePlugin]
  )

  useEffect(() => {
    loadCSS({
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css',
    }).then(() => setCssLoaded(true))
  }, [])

  useEffect(() => {
    if (created && cssLoaded) {
      setReady(true)
    }
  }, [created, cssLoaded])

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
