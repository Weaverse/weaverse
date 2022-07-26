import React, { createContext, forwardRef, useState } from 'react'
import { WeaverseElementProps } from '../../types'

interface AccordionElementProps extends WeaverseElementProps {
  items: any[]
}

interface accordionContext {
  active: null | number
  setActive: (param: number) => void
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
    const [active, setActive] = useState<number | null>(null)
    const setOpenAccordion = (id: number) => {
      if (id === active) {
        setActive(null)
      } else {
        setActive(id)
      }
    }
    // const headerStyle = {
    //   "--wv-acc-header-active":
    // }
    console.info('9779 active', active)
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
  items: [
    {
      id: 1,
      headerText: 'Header 1',
      childrenId: true,
    },
    {
      id: 2,
      headerText: 'Header 2',
    },
  ],
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      '.wv-accordion-header': {
        borderRadius: 4,
        padding: 4,
        backgroundColor: '#aaa',
        border: '1px solid #ddd',
        '&.active': {
          backgroundColor: 'aqua',
        },
        '&.active + .wv-accordion-content': {
          display: 'grid',
        },
      },
    },
  },
}

export default Accordion
