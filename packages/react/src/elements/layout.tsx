import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Layout = forwardRef((props: any, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      children={props.children || 'Layout Placeholder'}
    />
  )
})

export let schema: WeaverseElementSchema = {
  title: 'Layout',
  type: 'layout',
  data: {
    css: {
      '@desktop': {
        display: 'grid !important',
        gridTemplateRows: 'repeat($row-count, $row-size)',
        gridTemplateColumns: 'repeat($column-count, 1fr)',
        // gridAutoRows: '$sizes$rowSize',
        gridGap: '$gap',
        minHeight: '104px',
        width: '$grid-width',
        margin: '0 auto',
      },
      '@mobile': {
        display: 'flex !important',
        flexDirection: 'column',
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
