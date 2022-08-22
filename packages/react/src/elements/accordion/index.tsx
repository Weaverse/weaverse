import React, { createContext, forwardRef, useState } from 'react'
import type { WeaverseElementProps } from '~/types'

interface AccordionElementProps extends WeaverseElementProps {
  iconName: string
}

interface accordionContext {
  iconName: string
  active: string[]
  setActive: (param: string) => void
}

export const AccordionContext = createContext<accordionContext>({
  iconName: 'arrow',
  active: [],
  setActive: () => {
    //
  },
})

const Accordion = forwardRef<HTMLDivElement, AccordionElementProps>(
  (props, ref) => {
    const { iconName, children, ...rest } = props
    const [active, setActive] = useState<string[]>([])
    const setOpenAccordion = (id: string) => {
      if (active.includes(id)) {
        setActive(active.filter((_id) => _id !== id))
      } else {
        setActive([...active, id])
      }
    }

    return (
      <div ref={ref} {...rest}>
        <AccordionContext.Provider
          value={{ active, setActive: setOpenAccordion, iconName }}
        >
          {children}
        </AccordionContext.Provider>
      </div>
    )
  }
)

Accordion.defaultProps = {
  iconName: 'arrow',
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
  },
}

export default Accordion
