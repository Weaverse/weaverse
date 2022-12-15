import React from 'react'
import type { LayoutElementProps } from '~/types'

export function Overlay(
  props: Pick<LayoutElementProps, 'enableOverlay' | 'overlayOpacity'>
) {
  let { enableOverlay, overlayOpacity } = props
  if (enableOverlay) {
    let style = {
      ['--layout-overlay-opacity']: overlayOpacity / 100,
    } as React.CSSProperties
    return <div className="wv-layout-overlay" style={style} />
  }
  return null
}
