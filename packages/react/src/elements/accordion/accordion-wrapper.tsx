import React, { forwardRef, useContext } from 'react'
import type { WeaverseElementProps } from '~/types'
import { AccordionContext } from './index'
import Icon from '~/elements/accordion/Icon'

interface AccordionWrapperElementProps extends WeaverseElementProps {
  name: string
}

const AccordionWrapper = forwardRef<
  HTMLDivElement,
  AccordionWrapperElementProps
>((props, ref) => {
  const { ['data-wv-id']: wvId, name, children, ...rest } = props
  const { iconName, active, setActive } = useContext(AccordionContext)
  const isActive = active.includes(wvId)
  return (
    <div ref={ref} {...rest}>
      <div
        onClick={() => setActive(wvId)}
        className={`wv-acc-header ${isActive ? 'active' : ''}`}
      >
        <span>{name}</span>
        <Icon className="wv-acc-icon" active={isActive} name={iconName} />
      </div>
      {children}
    </div>
  )
})

export let css = {
  '@desktop': {
    maxHeight: '100%',
    // icon
    '.wv-acc-icon': {
      position: 'absolute',
      right: 16,
      width: 16,
      height: 16,
      transition: 'all 0.3s ease-in-out 0s',
    },
    // accordion header
    '.wv-acc-header': {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 4,
      padding: 12,
      marginBottom: 4,
      border: '1px solid #76A9FA',
      cursor: 'pointer',
      '&.active + [data-wv-type="accordion.content"]': {
        maxHeight: 'var(--max-height, inherit)',
      },
    },
  },
}

AccordionWrapper.defaultProps = {
  name: 'Accordion item',
}

export default AccordionWrapper
