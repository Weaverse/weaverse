import { TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Layout = forwardRef<HTMLElement, TODO>((props, ref) => {
  let { children, rows, gap, rowSize, columns, gridSize, ...rest } = props

  return (
    <section
      ref={ref}
      style={{
        '--grid-size': gridSize + 'px',
        '--rows': rows,
        '--columns': columns,
        '--gap': gap + 'px',
        '--row-size': rowSize + 'px',
        '--col-size':
          'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
      }}
      {...rest}
    >
      <div data-layout-content>{children}</div>
    </section>
  )
})

Layout.defaultProps = {
  gridSize: 1224,
  rows: 12,
  columns: 12,
  gap: 16,
  rowSize: 48,
  css: {
    '@desktop': {
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: 'var(--gap)',
      paddingRight: 'var(--gap)',
      '> [data-layout-content]': {
        margin: '0 auto',
        display: 'grid !important',
        gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
        gridTemplateColumns:
          'repeat(var(--columns), minmax(0, var(--col-size)))',
        gap: 'var(--gap)',
        maxWidth: 'var(--grid-size)',
      },
    },
    '@mobile': {
      padding: '0 16px',
      '> [data-layout-content]': {
        display: 'flex !important',
        flexDirection: 'column',
      },
    },
  },
}

export default Layout
