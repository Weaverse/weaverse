import clsx from 'clsx'
import type { MouseEvent } from 'react'
import React, { useContext } from 'react'
import type { ElementCSS } from '~/index'
import { WeaverseContext } from '~/index'
import type { SliderArrowsProps } from '~/types'
import { Icon } from '../Icons'

export function Arrows(props: SliderArrowsProps) {
  let { currentSlide, instanceRef, className } = props
  let { stitchesInstance } = useContext(WeaverseContext)
  let { className: cssClass } = stitchesInstance.css(css)()
  let isFirstSlide = currentSlide === 0
  let isLastSlide = false
  if (instanceRef.current) {
    isLastSlide = currentSlide === instanceRef?.current?.track?.details?.maxIdx
  }

  let _className = clsx(className, cssClass)
  let arrowLeftClass = clsx(
    'wv-slider-arrow arrow--left',
    isFirstSlide && 'arrow--disabled'
  )
  let arrowRightClass = clsx(
    'wv-slider-arrow arrow--right',
    isLastSlide && 'arrow--disabled'
  )

  return (
    <div className={_className}>
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
    </div>
  )
}

let css: ElementCSS = {
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
        left: '-80px',
      },
      '&.arrow--right': {
        right: '-80px',
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
