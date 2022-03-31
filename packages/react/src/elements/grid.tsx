import { WeaverseElementSchema } from '@weaverse/core/src'
import React, { forwardRef } from 'react'

let Grid = forwardRef((props: any, ref) => {
  return <div ref={ref} {...props} />
})

export let schema: WeaverseElementSchema = {
  title: 'Grid',
  type: 'grid',
  data: {
    css: {
      '@desktop': {
        display: 'grid',
        gridTemplateRows:
          'minmax(max-content,20%) minmax(max-content,20%) minmax(max-content,20%) minmax(max-content,20%) minmax(max-content,20%);',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        minHeight: '80px',
        backgroundColor: '#c7c7c7',
      },
    },
  },
  settings: [
    {
      tab: 'Layout',
      label: 'Grid',
      inspectors: [
        {
          type: 'grid',
        },
      ],
    },
  ],
}

export default Grid
