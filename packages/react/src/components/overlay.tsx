import { styled } from '@stitches/react'
import React from 'react'
import type { OverlayProps } from '~/types/components'

export function Overlay(props: OverlayProps) {
  let { enableOverlay: enabled, overlayOpacity: opacity, className } = props
  if (enabled) {
    return (
      <StyledOverlay
        className={className}
        css={{ ['--overlay-opacity']: opacity / 100 }}
      />
    )
  }
  return null
}

export let StyledOverlay = styled('div', {
  display: 'block !important',
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, var(--overlay-opacity, .3))',
})
