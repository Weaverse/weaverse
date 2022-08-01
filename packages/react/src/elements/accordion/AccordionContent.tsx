import React, { forwardRef } from 'react'
import { WeaverseElementProps } from '../../types'
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
    // '--col-size':
    //   'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
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
      backgroundColor: '#DDD',
      display: 'none',
      gridTemplate:
        'repeat(var(--rows),var(--row-size))/repeat(var(--columns),1fr)',
      gridGap: 'var(--gap)',
      borderRadius: 4,
    },
  },
}

export default AccordionContent
