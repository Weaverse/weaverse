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
        gridTemplateRows: 'repeat(auto-fill, $rowSize)',
        gridTemplateColumns: 'repeat($columns, 1fr)',
        gridGap: '$gap',
        minHeight: '480px',
        backgroundColor: '#c7c7c7',
      },
      '@mobile': {
        gridTemplateRows: '100%',
        gridTemplateColumns: '100%',
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
