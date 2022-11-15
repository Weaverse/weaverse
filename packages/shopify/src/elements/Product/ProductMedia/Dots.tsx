import type { ProductMediaDotsProps } from '~/types'
import React from 'react'
import clsx from 'clsx'

export function Dots({ currentSlide, instanceRef }: ProductMediaDotsProps) {
  if (instanceRef.current) {
    return (
      <div className="wv-slider-dots">
        {[...Array(instanceRef.current.track.details.slides.length).keys()].map(
          (idx) => {
            let className = clsx('dot', currentSlide === idx && 'dot--active')
            return (
              <button
                key={idx}
                type="button"
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={className}
              />
            )
          }
        )}
      </div>
    )
  }
  return null
}
