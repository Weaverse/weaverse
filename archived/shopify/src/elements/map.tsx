import type { ElementCSS } from '@weaverse/react'
import { forwardRef } from 'react'
import type { MapElementProps } from '~/types/components'

let MapElement = forwardRef<HTMLDivElement, MapElementProps>((props, ref) => {
  let { place, zoom, ...rest } = props

  return (
    <div ref={ref} {...rest}>
      <iframe
        height="100%"
        loading="lazy"
        src={`https://maps.google.com/maps?z=${zoom}&t=m&q=${place}&ie=UTF8&&output=embed`}
        style={{ pointerEvents: 'none' }}
        title="map"
        width="100%"
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

MapElement.defaultProps = {
  place: 'Hanoi',
  zoom: 14,
}

export default MapElement
