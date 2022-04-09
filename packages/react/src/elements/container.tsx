import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Container = forwardRef((props: any, ref) => {
  return <div ref={ref} {...props} />
})

export let schema: WeaverseElementSchema = {
  title: 'Container',
  type: 'container',
  data: {
    css: {
      '@desktop': {
        display: 'flex',
        backgroundColor: 'rgba(248,203,203,0.38)',
        gridArea: '1 / 1 / 3 / 6',
        minHeight: '96px',
      },
      '@mobile': {
        display: 'flex',
      },
    },
  },
  settings: [
    {
      tab: 'Settings',
      label: 'Alignment',
      inspectors: [
        {
          binding: 'style',
          type: 'alignment',
        },
        {
          binding: 'style',
          type: 'border',
        },
      ],
    },
    {
      tab: 'Settings',
      label: 'Visibility',
      inspectors: [
        {
          binding: 'style',
          type: 'visibility',
        },
      ],
    },
  ],
}

export default Container
