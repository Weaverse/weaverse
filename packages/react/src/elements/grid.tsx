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
        gridTemplateRows: 'repeat(auto-fill, 48px)',
        gridTemplateColumns: 'repeat(16, 1fr)',
        gridGap: '8px',
        minHeight: '480px',
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
