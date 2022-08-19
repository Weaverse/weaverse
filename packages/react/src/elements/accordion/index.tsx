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
    },
  },
}

export default Accordion
