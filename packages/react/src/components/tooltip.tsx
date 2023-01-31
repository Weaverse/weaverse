import type { TooltipProps } from '~/types/components'
import React from 'react'

export function Tooltip({ children }: TooltipProps) {
  return <span className="wv-tooltip">{children}</span>
}
