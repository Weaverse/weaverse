import { styled } from '@stitches/react'
import clsx from 'clsx'
import React from 'react'
import type { SliderDotsProps } from '~/types'

export function Dots(props: SliderDotsProps) {
  let { currentSlide, instanceRef, className } = props
  return (
    <StyledDots className={className}>
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
        }
      )}
    </StyledDots>
  )
}

let StyledDots = styled('div', {
  padding: '10px 0',
  justifyContent: 'center',
  '.dot': {
    width: '9px',
    height: '9px',
    padding: '0',
    margin: '0 5px',
    border: 'none',
    borderRadius: '50%',
    background: '#2125291a',
    transition: 'all 0.2s ease-in-out',
    '&.dot--active': {
      background: '#212529',
    },
  },
})
