import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Layout = forwardRef((props: any, ref) => {
  const { css, children, rowCount, rowGap, rowHeight, columnCount, columnGap, gridWidth, layoutWidth, ...rest } = props
  return (
    <div
      ref={ref}
      style={{
        '--row-count': rowCount,
        '--row-gap': rowGap + 'px',
        '--row-height': rowHeight + 'px',
        '--col-count': columnCount,
        '--col-gap': columnGap + 'px',
        '--grid-width': gridWidth + 'px',
        '--layout-width': layoutWidth + '%',
        '--edge-width': 'calc((var(--layout-width) - var(--grid-width)) / 2)',
        '--col-width': 'calc((var(--grid-width) - calc(var(--col-count) - 1) * var(--col-gap)) / var(--col-count))'
      }}
      {...rest}
    >
      {children}
    </div>
  )
})

export let schema: WeaverseElementSchema = {
  title: 'Layout',
  type: 'layout',
  data: {
    css: {
      '@desktop': {
        display: 'grid !important',
        gridTemplateRows: 'repeat(var(--row-count), var(--row-height))',
        gridTemplateColumns: 'var(--edge-width) 1fr repeat(var(--col-count),var(--col-width)) 1fr var(--edge-width)',
        gridGap: 'var(--row-gap) var(--col-gap)',
      },
      '@mobile': {
        display: 'flex !important',
        flexDirection: 'column',
      },
    },
    rowCount: 12,
    rowGap: 8,
    rowHeight: 48,
    columnCount: 16,
    columnGap: 8,
    gridWidth: 1224,
    layoutWidth: 100,
  },
  settings: [
  ],
}

export default Layout
