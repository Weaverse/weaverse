import React, { createContext, forwardRef, useState } from 'react'
import type { WeaverseElementProps } from '~/types'
import { TabHeaderWrapper } from './TabHeaderWrapper'

interface tabContext {
  active: null | string | number
  setActive: (param: string | number) => void
}

export const TabContext = createContext<tabContext>({
  active: null,
  setActive: () => {
    //
  },
})

const Tab = forwardRef<HTMLDivElement, WeaverseElementProps>((props, ref) => {
  const wvId = props['data-wv-id']
  const { children, ...rest } = props
  const defaultActive = (React.Children.toArray(children)?.[0] as any)?.props
    ?.id
  const [active, setActive] = useState<string | number | null>(defaultActive)
  const setOpenTab = (id: string | number) => {
    if (id !== active) {
      setActive(id)
    }
  }
  return (
    <div ref={ref} {...rest}>
      <TabContext.Provider value={{ active, setActive: setOpenTab }}>
        <TabHeaderWrapper wvId={wvId} />
        {children}
      </TabContext.Provider>
    </div>
  )
})

Tab.defaultProps = {
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      '& .wv-tab-header-wrapper': {
        width: '100%',
        display: 'flex',
        marginBottom: 10,
      },
      '& .wv-tab-header': {
        backgroundColor: '#fff',
        padding: '15px 24px',
        border: '1px solid #E4E7EB',
        cursor: 'pointer',
        '&.active': {
          backgroundColor: '#E4E7EB',
        },
      },
    },
  },
}

export default Tab
