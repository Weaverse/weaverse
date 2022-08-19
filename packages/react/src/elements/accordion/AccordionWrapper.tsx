import React, { forwardRef, useContext } from 'react'
import type { WeaverseElementProps } from '~/types'
import { AccordionContext } from './index'

interface AccordionWrapperElementProps extends WeaverseElementProps {
  name: string
}

const AccordionWrapper = forwardRef<
  HTMLDivElement,
  AccordionWrapperElementProps
>((props, ref) => {
  const { ['data-wv-id']: wvId, name, children, ...rest } = props
  const { active, setActive } = useContext(AccordionContext)

  return (
    <div ref={ref} {...rest}>
      <div
        onClick={() => setActive(wvId)}
        className={`wv-accordion-header ${active === wvId ? 'active' : ''}`}
      >
        {name}
      </div>
      {children}
    </div>
  )
})

AccordionWrapper.defaultProps = {
  name: 'Accordion item',
  css: {
    '@desktop': {
      maxHeight: '100%',
    },
  },
}

export default AccordionWrapper
