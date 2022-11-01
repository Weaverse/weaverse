import React from 'react'
import type { TimerBlockProps } from '~/types'

export function TimerBlock({ value, label }: TimerBlockProps) {
  return (
    <div className="wv-cd-block">
      <div className="wv-cd-number">
        {typeof value === 'string' ? value : value.toString().padStart(2, '0')}
      </div>
      {label && <div className="wv-cd-label">{label}</div>}
    </div>
  )
}
