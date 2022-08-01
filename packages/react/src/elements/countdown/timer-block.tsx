import React from 'react'
import type { TimerBlockProps } from '../../types'

export function TimerBlock({ value, label }: TimerBlockProps) {
  return (
    <div>
      <div className="wv-countdown-number">
        {value.toString().padStart(2, '0')}
      </div>
      {label && <div className="wv-countdown-label">{label}</div>}
    </div>
  )
}
