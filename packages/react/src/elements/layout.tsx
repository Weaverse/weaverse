import { WeaverseElementSchema } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Layout = forwardRef((props: any, ref) => {
  const { css, children, rows, gap, rowSize, columns, gridSize, ...rest } = props
  return (
    <section
      ref={ref}
      style={{
        '--grid-size': gridSize + 'px',
        '--rows': rows,
        '--columns': columns,
        '--gap': gap + 'px',
        '--row-size': rowSize + 'px',
        '--col-size': 'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
      }}
      {...rest}
    >
      <div data-layout-content>
        {children}
      </div>
    </section>
  )
})

export let schema: WeaverseElementSchema = {
  title: 'Layout',
  type: 'layout',
  data: {
    css: {
      '@desktop': {
        overflow: 'hidden',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: 'var(--gap)',
        paddingRight: 'var(--gap)',
        '> [data-layout-content]': {
          margin: '0 auto',
          display: 'grid !important',
          gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
          gridTemplateColumns: 'repeat(var(--columns), minmax(0, var(--col-size)))',
          gap: 'var(--gap)',
          maxWidth: 'var(--grid-size)',
        }
      },
      '@mobile': {
        padding: "0",
        '> [data-layout-content]': {
          display: 'flex !important',
          flexDirection: 'column',
        }
      },
    },
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
