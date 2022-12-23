import type { TooltipProps } from '~/types'
import React from 'react'

export function Tooltip({ children }: TooltipProps) {
  return <span className="wv-tooltip">{children}</span>
}
