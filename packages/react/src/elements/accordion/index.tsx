import React, { createContext, forwardRef, useState } from 'react'
import type { WeaverseElementProps } from '~/types'

interface AccordionElementProps extends WeaverseElementProps {
  iconStyle: string
}

interface accordionContext {
  iconStyle: string
  active: null | string
  setActive: (param: string) => void
}

export const AccordionContext = createContext<accordionContext>({
  iconStyle: 'arrow',
  active: null,
  setActive: () => {
    //
  },
})

const Accordion = forwardRef<HTMLDivElement, AccordionElementProps>(
  (props, ref) => {
    const { iconStyle, children, ...rest } = props
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
          value={{ active, setActive: setOpenAccordion, iconStyle }}
        >
          {children}
        </AccordionContext.Provider>
      </div>
    )
  }
)

Accordion.defaultProps = {
  iconStyle: 'arrow',
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
  },
}

export default Accordion
