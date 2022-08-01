import React, { forwardRef, useContext } from 'react'
import { WeaverseElementProps } from '../../types'
import { AccordionContext } from './index'

interface AccordionWrapperElementProps extends WeaverseElementProps {
  wrapperId: number
  headerText: string
}

const AccordionWrapper = forwardRef<
  HTMLDivElement,
  AccordionWrapperElementProps
>((props, ref) => {
  const { wrapperId, headerText, children, ...rest } = props
  const { active, setActive } = useContext(AccordionContext)

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
      {children}
    </div>
  )
})

AccordionWrapper.defaultProps = {
  wrapperId: 1,
  headerText: 'Header 1',
  css: {
    '@desktop': {
      maxHeight: '100%',
    },
  },
}

export default AccordionWrapper
