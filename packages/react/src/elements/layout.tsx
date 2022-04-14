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
        display: 'grid !important',
        gridTemplateRows: 'repeat(auto-fill, $rowSize)',
        gridTemplateColumns: 'repeat($columns, 1fr)',
        gridGap: '$gap',
        minHeight: '104px',
        width: '100%',
        margin: '0 auto',
      },
      '@mobile': {
        display: 'flex !important',
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
