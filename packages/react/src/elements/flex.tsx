import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Flex = forwardRef((props: any, ref) => {
  return <div ref={ref} {...props} />
})

export let schema: WeaverseElementSchema = {
  title: 'Flex',
  type: 'flex',
  data: {
    css: {
      '@desktop': {
        display: 'flex',
        backgroundColor: 'rgba(248,203,203,0.38)',
        gridArea: '1 / 1 / 3 / 6',
      },
    },
  },
  settings: [
    {
      tab: 'Layout',
      label: 'Flex',
      inspectors: [
        {
          type: 'flex',
        },
      ],
    },
  ],
}

export default Flex
