import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useState } from 'react'
import type { SliderProps } from '~/types/components'
import { Arrows } from './arrows'
import { ResizePlugin } from './resize-plugin'

export function Slider(props: SliderProps) {
  let { children, className, gap, slidesPerView, arrowOffset } = props
  let [currentSlide, setCurrentSlide] = useState(0)
  let [created, setCreated] = useState(false)
  let [ref, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slides: { perView: slidesPerView, spacing: gap },
      breakpoints: {
        '(max-width: 1024px)': {
          slides: { perView: 3, spacing: gap },
        },
        '(max-width: 768px)': {
          slides: {
            perView: 1,
            spacing: 32,
          },
        },
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
  let _className = clsx('keen-slider', className)
  let arrowsClass = clsx(className && `${className}-arrows`)

  return (
    <>
      <div className={_className} ref={ref}>
        <link
          href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
          rel="stylesheet"
        />
        {children}
      </div>
      {created && instanceRef?.current && (
        <Arrows
          className={arrowsClass}
          currentSlide={currentSlide}
          icon="arrow"
          instanceRef={instanceRef}
          offset={arrowOffset}
        />
      )}
    </>
  )
}
