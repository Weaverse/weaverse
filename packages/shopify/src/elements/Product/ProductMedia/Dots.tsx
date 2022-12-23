import type { ProductMediaDotsProps } from '~/types'
import React from 'react'
import clsx from 'clsx'
import type { ElementCSS } from '@weaverse/react'

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

export let css: ElementCSS = {
  '@desktop': {
    '.wv-slider-dots': {
      display: 'none',
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
    },
  },
  '@mobile': {
    '.wv-slider-dots': {
      display: 'flex',
    },
  },
}
