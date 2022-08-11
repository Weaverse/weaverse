import React, { forwardRef } from 'react'
import type { WeaverseElementProps } from '../../types'
import Placeholder from '../shared/Placeholder'

interface AccordionContentElementProps extends WeaverseElementProps {
  rows: number
  columns: number
  gap: number
  rowSize: number
}

const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentElementProps
>((props, ref) => {
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
    <div ref={ref} {...rest} style={style}>
      {React.Children.count(children) > 0 ? (
        children
      ) : (
        <Placeholder element="Accordion">Item Content</Placeholder>
      )}
    </div>
  )
})

AccordionContent.defaultProps = {
  rows: 2,
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
      overflow: 'hidden',
      maxHeight: 0,
      transition: 'all var(--transition-duration, 0.3s) ease-in-out',
      borderRadius: 4,
    },
  },
}

export default AccordionContent
