import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import type { MapElementProps } from '~/types'

let Map = forwardRef<HTMLDivElement, MapElementProps>((props, ref) => {
  let { place, zoom, ...rest } = props

  return (
    <div ref={ref} {...rest}>
      <iframe
        loading="lazy"
        width="100%"
        height="100%"
        title="map"
        src={`https://maps.google.com/maps?z=${zoom}&t=m&q=${place}&ie=UTF8&&output=embed`}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    iframe: {
      border: 'none',
    },
  },
  '@mobile': {
    iframe: {
      border: 'none',
    },
  },
}

Map.defaultProps = {
  place: 'Hanoi',
  zoom: 14,
}

export default Map
