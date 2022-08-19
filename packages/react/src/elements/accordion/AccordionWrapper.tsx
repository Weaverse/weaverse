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
  const { active, setActive } = useContext(AccordionContext)

  return (
    <div ref={ref} {...rest}>
      <div
        onClick={() => setActive(wvId)}
        className={`wv-accordion-header ${active === wvId ? 'active' : ''}`}
      >
        <span>{name}</span>
        <span className="wv-icon">
          <Icon name="plus" />
        </span>
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
      // icon
      '.wv-icon': {
        position: 'absolute',
        right: 16,
        width: 16,
        height: 16,
        transition: 'all 0.3s ease-in-out 0s',
      },
      // accordion header
      '.wv-accordion-header': {
        borderRadius: 4,
        padding: 12,
        marginBottom: 4,
        border: '1px solid #76A9FA',
        cursor: 'pointer',
        '&.active': {
          color: 'blue',
          '.wv-icon': {
            transform: 'rotate(90deg)',
          },
        },
        '&.active + [data-wv-type="accordion.content"]': {
          maxHeight: 'var(--max-height, inherit)',
        },
      },
    },
  },
}

export default AccordionWrapper
