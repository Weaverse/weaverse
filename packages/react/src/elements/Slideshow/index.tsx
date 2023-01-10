import type { ElementCSS } from '@weaverse/core'
import { useKeenSlider } from 'keen-slider/react'
import React, { forwardRef, useEffect, useState } from 'react'
import { Arrows } from '~/components/Slider/Arrows'
import { Dots } from '~/components/Slider/Dots'
import { ResizePlugin } from '~/components/Slider/ResizePlugin'
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
    autoRotate,
    changeSlidesEvery,
    children,
    ...rest
  } = props
  let [cssLoaded, setCssLoaded] = useState(false)
  let [created, setCreated] = useState(false)
  let [ready, setReady] = useState(false)
  let [currentSlide, setCurrentSlide] = useState(0)
  let [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slides: {
        perView: slidesPerView,
      },
      created: () => {
        setCreated(true)
      },
      slideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel)
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

  return (
    <div ref={ref} style={style} {...rest}>
      <div ref={sliderRef} className="keen-slider">
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
  },
}

Slideshow.defaultProps = {
  animation: 'fade',
  slidesPerView: 1,
  spacing: 0,
  showArrows: true,
  showDots: true,
  dotsPosition: 'bottom',
  dotsColor: 'light',
  autoRotate: false,
  changeSlidesEvery: 5,
}

export default Slideshow
