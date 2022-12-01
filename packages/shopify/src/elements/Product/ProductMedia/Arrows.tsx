import { Components } from '@weaverse/react'
import clsx from 'clsx'
import type { HTMLAttributes, MouseEvent } from 'react'
import React from 'react'
import type { ProductMediaArrowsProps } from '~/types'
let { Icon } = Components

export function Arrows({ currentSlide, instanceRef }: ProductMediaArrowsProps) {
  let isFirstSlide = currentSlide === 0
  let isLastSlide = false
  if (instanceRef.current) {
    isLastSlide =
      currentSlide === instanceRef?.current?.track?.details?.slides?.length - 1
  }

  let arrowLeftClass = clsx(
    'wv-slider-arrow arrow--left',
    isFirstSlide && 'arrow--disabled'
  )
  let arrowRightClass = clsx(
    'wv-slider-arrow arrow--right',
    isLastSlide && 'arrow--disabled'
  )
  return (
    <>
      <button
        type="button"
        className={arrowLeftClass}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          instanceRef?.current?.prev()
        }}
      >
        <Icon name="ArrowLeft" />
      </button>
      <button
        type="button"
        className={arrowRightClass}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          instanceRef?.current?.next()
        }}
      >
        <Icon name="ArrowRight" />
      </button>
    </>
  )
}
