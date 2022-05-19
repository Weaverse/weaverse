import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Layout = forwardRef((props: any, ref) => {
  const { css, children, rows, gap, rowSize, columns, gridSize, contentSize, ...rest } = props
  return (
    <div
      ref={ref}
      style={{
        '--content-size': contentSize + 'px',
        '--grid-size': gridSize + 'px',
        '--rows': rows,
        '--columns': columns,
        '--gap': gap + 'px',
        '--row-size': rowSize + 'px',
        '--col-size': 'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
        '--edge-size': 'calc((100vw - var(--content-size)) / 2)',
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
        gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
        gridTemplateColumns: 'var(--edge-size) 1fr repeat(var(--columns), var(--col-size)) 1fr var(--edge-size)',
        gridGap: 'var(--gap)',
      },
      '@mobile': {
        display: 'flex !important',
        flexDirection: 'column',
      },
    },
    contentSize: 1600,
    gridSize: 1224,
    rows: 12,
    columns: 12,
    gap: 16,
    rowSize: 48,
  },
  settings: [
  ],
}

export default Layout
