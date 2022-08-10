import React, { forwardRef, useContext } from 'react'
import type { WeaverseElementProps } from '../../types'
import { AccordionContext } from './index'

interface AccordionWrapperElementProps extends WeaverseElementProps {
  wrapperId: number
  headerText: string
}

const AccordionWrapper = forwardRef<
  HTMLDivElement,
  AccordionWrapperElementProps
>((props, ref) => {
  const { ['data-wv-id']: wvId, headerText, children, ...rest } = props
  const { active, setActive } = useContext(AccordionContext)

  return (
    <div ref={ref} {...rest}>
      <div
        onClick={() => setActive(wvId)}
        className={`wv-accordion-header ${active === wvId ? 'active' : ''}`}
      >
        {headerText}
      </div>
      {children}
    </div>
  )
})

AccordionWrapper.defaultProps = {
  headerText: 'Header text',
  css: {
    '@desktop': {
      maxHeight: '100%',
    },
  },
}

export default AccordionWrapper
