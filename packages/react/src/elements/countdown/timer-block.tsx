import { TODO } from '@weaverse/core'
import React from 'react'

export function TimerBlock({ value, label }: TODO) {
  return (
    <div>
      <div className="wv-countdown-number">
        {value.toString().padStart(2, '0')}
      </div>
      {label && <div className="wv-countdown-label">{label}</div>}
    </div>
  )
}
