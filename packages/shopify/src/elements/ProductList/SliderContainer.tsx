import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import React, { useState } from 'react'

export interface SliderProps {
  children: React.ReactNode
  className?: string
}

export function SliderContainer({ children, className }: SliderProps) {
  let [created, setCreated] = useState(false)
  let [ref, instanceRef] = useKeenSlider<HTMLDivElement>({
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
  })
  let _className = clsx('keen-slider', className)

  return (
    <div ref={ref} className={_className}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
      />
      {children}
      {/* {created && instanceRef?.current && (
        <Arrows currentSlide={currentSlide} instanceRef={instanceRef} />
      )} */}
    </div>
  )
}
