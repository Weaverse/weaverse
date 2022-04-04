import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Layout = forwardRef((props: any, ref) => {
  return <div ref={ref} {...props} />
})

export let schema: WeaverseElementSchema = {
  title: 'Layout',
  type: 'layout',
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
        display: 'flex',
      },
    },
  },
  settings: [
    {
      tab: 'Settings',
      label: 'Spacing',
      inspectors: [
        {
          binding: 'style',
          type: 'spacing',
        },
      ],
    },
  ],
}

export default Layout
