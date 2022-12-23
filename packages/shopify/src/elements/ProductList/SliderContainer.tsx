import { useKeenSlider } from 'keen-slider/react'
import React from 'react'

export function SliderContainer({ children }: { children: React.ReactNode }) {
  let [ref] = useKeenSlider<HTMLDivElement>({
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
  })

  return (
    <div ref={ref} className="keen-slider wv-product-list__slider">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
      />
      {children}
    </div>
  )
}
