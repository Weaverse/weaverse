import React, { FC, forwardRef } from 'react'
import { TODO, WeaverseElementSchema } from '@weaverse/core'

const Map = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  const { place, zoom, ...rest } = props

  return (
    <div ref={ref} {...rest}>
      <iframe
        loading="lazy"
        scrolling="no"
        width="100%"
        height="100%"
        title="map"
        src={`https://maps.google.com/maps?z=${zoom}&t=m&q=${place}&ie=UTF8&&output=embed`}
        style={{
          pointerEvents: 'none',
        }}
      />
    </div>
  )
})

Map.defaultProps = {
  place: 'Hanoi',
  zoom: 14,
  css: {
    '@desktop': {
      gridArea: '1 / 1 / 11 / 13',
    },
  },
}

export default Map
