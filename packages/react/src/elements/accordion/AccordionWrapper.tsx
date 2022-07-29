import React, { forwardRef, useContext } from 'react'
import { WeaverseElementProps } from '../../types'
import { AccordionContext } from './index'
import Placeholder from '../shared/Placeholder'

interface AccordionContentElementProps extends WeaverseElementProps {
  wrapperId: number
  rows: number
  columns: number
  gap: number
  rowSize: number
  headerText: string
}

const AccordionWrapper = forwardRef<
  HTMLDivElement,
  AccordionContentElementProps
>((props, ref) => {
  const {
    rows,
    columns,
    gap,
    rowSize,
    wrapperId,
    headerText,
    children,
    ...rest
  } = props
  const { active, setActive } = useContext(AccordionContext)

  let style = {
    '--rows': rows,
    '--columns': columns,
    '--gap': gap + 'px',
    '--row-size': rowSize + 'px',
    // '--col-size':
    //   'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
  } as React.CSSProperties

  return (
    <div ref={ref} {...rest}>
      <div
        onClick={() => setActive(wrapperId)}
        className={`wv-accordion-header ${
          active === wrapperId ? 'active' : ''
        }`}
      >
        {headerText} #{wrapperId}
      </div>
      <div style={style} className="wv-accordion-content">
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <Placeholder element="Accordion">Item Content</Placeholder>
        )}
      </div>
    </div>
  )
})

AccordionWrapper.defaultProps = {
  rows: 4,
  columns: 12,
  gap: 4,
  rowSize: 48,
  wrapperId: 1,
  headerText: 'Header 1',
  css: {
    '@desktop': {
      maxHeight: '100%',
      '.wv-accordion-content': {
        width: '100%',
        backgroundColor: '#DDD',
        display: 'none',
        gridTemplate:
          'repeat(var(--rows),var(--row-size))/repeat(var(--columns),1fr)',
        borderRadius: 4,
      },
    },
  },
}

export default AccordionWrapper
