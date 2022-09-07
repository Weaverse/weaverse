import React, { forwardRef } from 'react'
import type { TODO } from '@weaverse/core'

let ProductContent = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  const { rows, columns, gap, rowSize, children, ...rest } = props
  let style = {
    '--rows': rows,
    '--columns': columns,
    '--gap': gap + 'px',
    '--row-size': rowSize + 'px',
    '--col-size':
      'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
    '--max-height': rows * rowSize + gap * (rowSize - 1) + 'px',
  } as React.CSSProperties
  return (
    <div {...rest} ref={ref} style={style}>
      {React.Children.count(children) > 0 ? (
        children
      ) : (
        <div>Please drag and drop an element here</div>
      )}
    </div>
  )
})

ProductContent.defaultProps = {
  rows: 7,
  columns: 12,
  gap: 4,
  rowSize: 48,
  css: {
    '@desktop': {
      width: '100%',
      maxWidth: 'var(--grid-size)',
      display: 'grid',
      gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
      gridTemplateColumns: 'repeat(var(--columns), minmax(0, var(--col-size)))',
      gap: 'var(--gap)',
    },
  },
}

export default ProductContent
