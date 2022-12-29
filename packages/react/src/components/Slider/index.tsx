import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import React, { useState } from 'react'
import type { SliderProps } from '~/types'
import { Arrows } from './Arrows'
import { ResizePlugin } from './ResizePlugin'

export function Slider({ children, className }: SliderProps) {
  let [currentSlide, setCurrentSlide] = useState(0)
  let [created, setCreated] = useState(false)
  let [ref, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slides: { perView: 4, spacing: 16 },
      breakpoints: {
        '(max-width: 1024px)': {
          slides: { perView: 3, spacing: 16 },
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
      <div ref={ref} className={_className}>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
        />
        {children}
      </div>
      {created && instanceRef?.current && (
        <Arrows
          currentSlide={currentSlide}
          instanceRef={instanceRef}
          className={arrowsClass}
        />
      )}
    </>
  )
}
