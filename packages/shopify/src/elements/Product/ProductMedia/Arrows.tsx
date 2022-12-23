import type { ElementCSS } from '@weaverse/react'
import { Components } from '@weaverse/react'
import clsx from 'clsx'
import type { MouseEvent } from 'react'
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

export let css: ElementCSS = {
  '@desktop': {
    '.wv-slider-arrow': {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '44px',
      height: '44px',
      padding: '8px',
      color: '#191919',
      backgroundColor: '#f2f2f2',
      textAlign: 'center',
      transition: 'all 0.2s ease-in-out',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#191919',
        color: '#f2f2f2',
      },
      svg: {
        verticalAlign: 'middle',
        width: '22px',
        height: '22px',
      },
      '&.arrow--left': {
        left: '10px',
      },
      '&.arrow--right': {
        right: '10px',
      },
      '&.arrow--disabled': {
        opacity: 0.5,
      },
    },
  },
  '@mobile': {
    '.wv-slider-arrow': {
      display: 'none',
    },
  },
}
