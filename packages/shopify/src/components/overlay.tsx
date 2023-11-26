import React from 'react'

import type { OverlayProps } from '~/types/components'

export function Overlay(props: OverlayProps) {
  let { enableOverlay, overlayOpacity, className } = props
  if (enableOverlay) {
    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
        }}
      />
    )
  }
  return null
}
