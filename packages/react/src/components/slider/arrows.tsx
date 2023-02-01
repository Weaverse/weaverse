import { styled } from '@stitches/react'
import clsx from 'clsx'
import type { MouseEvent } from 'react'
import React from 'react'
import type { SliderArrowsProps } from '~/types/components'
import { Icon } from '../icons'

export function Arrows(props: SliderArrowsProps) {
  let { currentSlide, instanceRef, className, offset } = props
  let isFirst = currentSlide === 0
  let isLast = false
  if (instanceRef.current) {
    isLast = currentSlide === instanceRef?.current?.track?.details?.maxIdx
  }
  let style = {
    '--offset': `${offset}px`,
  } as React.CSSProperties

  return (
    <StyledArrows className={className} style={style}>
      <button
        type="button"
        className={clsx('arrow arrow--left', isFirst && 'arrow--disabled')}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          instanceRef?.current?.prev()
        }}
      >
        <Icon name="ArrowLeft" />
      </button>
      <button
        type="button"
        className={clsx('arrow arrow--right', isLast && 'arrow--disabled')}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          instanceRef?.current?.next()
        }}
      >
        <Icon name="ArrowRight" />
      </button>
    </StyledArrows>
  )
}

let StyledArrows = styled('div', {
  '.arrow': {
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
      left: 'var(--offset, 0px)',
    },
    '&.arrow--right': {
      right: 'var(--offset, 0px)',
    },
    '&.arrow--disabled': {
      opacity: 0.5,
    },
  },
  '@media (max-width: 768px)': {
    '.arrow': {
      display: 'none',
    },
  },
})
