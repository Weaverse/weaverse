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
        gridTemplateRows: 'repeat(auto-fill, $rowSize)',
        gridTemplateColumns: 'repeat($columns, 1fr)',
        gridAutoRows: '$sizes$rowSize',
        gridGap: '$gap',
        minHeight: '104px',
        width: '100%',
        margin: '0 auto',
      },
      '@mobile': {
        display: 'flex !important',
        flexDirection: 'column',
      },
    },
  },
  settings: [
  ],
}

export default Layout
