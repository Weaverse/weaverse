import React, { FC, forwardRef } from 'react'
import { WeaverseElementSchema } from '@weaverse/core'

const Map: FC = forwardRef((props, ref) => {
  const { place, zoom } = props
  console.info('9779 props', props)
  return (
    <div ref={ref} {...props}>
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
}

export const schema: WeaverseElementSchema = {
  title: 'Map',
  type: 'map',
  parentType: 'layout',
  toolbar: [
    {
      type: 'delete',
    },
    {
      type: 'duplicate',
    },
    {
      type: 'link',
    },
    {
      type: 'color',
    },
  ],
  data: {
    css: {
      '@desktop': {
        gridArea: '1 / 1 / 11 / 13',
      },
    },
  },
  flags: {
    resizable: true,
    draggable: true,
    sortable: true,
  },
}

export default Map
