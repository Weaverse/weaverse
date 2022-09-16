import React, { forwardRef } from 'react'
import type { LayoutElementProps } from '~/types'

let Layout = forwardRef<HTMLElement, LayoutElementProps>((props, ref) => {
  let { children, rows, gap, rowSize, columns, gridSize, ...rest } = props
  let style = {
    '--grid-size': gridSize + 'px',
    '--rows': rows,
    '--columns': columns,
    '--gap': gap + 'px',
    '--row-size': rowSize + 'px',
    '--col-size':
      'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
  } as React.CSSProperties

  return (
    <section ref={ref} {...rest} style={style}>
      <div data-layout-content>{children}</div>
    </section>
  )
})

export let css = {
  '@desktop': {
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
    },
  },
  '@mobile': {
    padding: '0 16px',
    '> [data-layout-content]': {
      display: 'flex !important',
      flexDirection: 'column',
    },
  },
}

Layout.defaultProps = {
  gridSize: 1224,
  rows: 12,
  columns: 12,
  gap: 16,
  rowSize: 48,
}

export default Layout
