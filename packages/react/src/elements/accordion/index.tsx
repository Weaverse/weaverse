import React, { createContext, forwardRef, useState } from 'react'
import type { WeaverseElementProps } from '~/types'

interface AccordionElementProps extends WeaverseElementProps {
  items: any[]
}

interface accordionContext {
  active: null | string
  setActive: (param: string) => void
}

export const AccordionContext = createContext<accordionContext>({
  active: null,
  setActive: () => {
    //
  },
})

const Accordion = forwardRef<HTMLDivElement, AccordionElementProps>(
  (props, ref) => {
    const { items, children, ...rest } = props
    const [active, setActive] = useState<string | null>(null)
    const setOpenAccordion = (id: string) => {
      if (id === active) {
        setActive(null)
      } else {
        setActive(id)
      }
    }
    // const headerStyle = {
    //   "--wv-acc-header-active":
    // }
    return (
      <div ref={ref} {...rest}>
        <AccordionContext.Provider
          value={{ active, setActive: setOpenAccordion }}
        >
          {children}
        </AccordionContext.Provider>
      </div>
    )
  }
)

Accordion.defaultProps = {
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      '.wv-accordion-header': {
        borderRadius: 4,
        padding: 12,
        marginBottom: 4,
        border: '1px solid #76A9FA',
        '&.active': {
          color: 'blue',
        },
        '&.active + [data-wv-type="accordion.content"]': {
          maxHeight: 'var(--max-height, inherit)',
        },
      },
    },
  },
}

export default Accordion
