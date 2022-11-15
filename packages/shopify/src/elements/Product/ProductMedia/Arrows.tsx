import clsx from 'clsx'
import type { HTMLAttributes, MouseEvent, SVGProps } from 'react'
import React from 'react'
import type { ProductMediaArrowsProps } from '~/types'

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
      <ArrowLeft
        className={arrowLeftClass}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          instanceRef?.current?.prev()
        }}
      />
      <ArrowRight
        className={arrowRightClass}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          instanceRef?.current?.next()
        }}
      />
    </>
  )
}

function ArrowLeft(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="192"
        height="192"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <rect width="256" height="256" fill="none" />
        <line
          x1="216"
          y1="128"
          x2="40"
          y2="128"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <polyline
          points="112 56 40 128 112 200"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
      </svg>
    </button>
  )
}

function ArrowRight(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="192"
        height="192"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <rect width="256" height="256" fill="none" />
        <line
          x1="40"
          y1="128"
          x2="216"
          y2="128"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <polyline
          points="144 56 216 128 144 200"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
      </svg>
    </button>
  )
}
