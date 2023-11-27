import { styled } from '@stitches/react'
import clsx from 'clsx'
import React from 'react'

import type { SliderDotsProps } from '~/types/components'

export function Dots(props: SliderDotsProps) {
  let { currentSlide, instanceRef, className, absolute, position, color } =
    props
  let _className = clsx(
    className,
    absolute && 'dots--absolute',
    position && `dots--${position}`,
    color && `dots--${color}`,
  )
  return (
    <StyledDots className={_className}>
      {[...Array(instanceRef.current?.track.details.slides.length).keys()].map(
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
        },
      )}
    </StyledDots>
  )
}

let StyledDots = styled('div', {
  padding: '10px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  '&.dots--absolute': {
    position: 'absolute',
    '&.dots--top, &.dots--bottom': { left: 0, right: 0 },
    '&.dots--top': { top: 10 },
    '&.dots--bottom': { bottom: 10 },
    '&.dots--left, &.dots--right': {
      top: 0,
      bottom: 0,
      flexDirection: 'column',
    },
    '&.dots--left': { left: 20 },
    '&.dots--right': { right: 20 },
  },
  '&.dots--light': {
    '.dot': {
      backgroundColor: '#ffffff66',
      '&.dot--active': {
        backgroundColor: '#ffffff',
      },
    },
  },
  '&.dots--dark': {
    '.dot': {
      backgroundColor: '#00000033',
      '&.dot--active': {
        backgroundColor: '#000000',
      },
    },
  },
  '.dot': {
    width: '9px',
    height: '9px',
    padding: '0',
    border: 'none',
    borderRadius: '50%',
    transition: 'all 0.2s ease-in-out',
  },
})
