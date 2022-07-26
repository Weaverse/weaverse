import React, { forwardRef, useContext } from 'react'
import { WeaverseElementProps } from '../../types'
import { AccordionContext } from './index'

interface AccordionContentElementProps extends WeaverseElementProps {
  wrapperId: number
  headerText: string
}

const AccordionWrapper = forwardRef<
  HTMLDivElement,
  AccordionContentElementProps
>((props, ref) => {
  const { wrapperId, headerText, children, ...rest } = props
  const { active, setActive } = useContext(AccordionContext)
  console.info('9779 active', active)
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
      <div ref={ref} className="wv-accordion-content">
        {React.Children.count(children) > 0 ? children : 'Item Content'}
      </div>
    </div>
  )
})

AccordionWrapper.defaultProps = {
  wrapperId: 1,
  headerText: 'Header 1',
  css: {
    '@desktop': {
      maxHeight: '100%',
      '.wv-accordion-content': {
        minHeight: 100,
        width: '100%',
        height: '100%',
        backgroundColor: '#DDD',
        display: 'none',
        gridTemplate: 'repeat(12,1fr)/repeat(12,1fr)',
        border: '1px dashed #0F71FF',
        borderRadius: 4,
      },
    },
  },
}

export default AccordionWrapper
