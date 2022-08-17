import React, { createContext, forwardRef, useState } from 'react'
import type { WeaverseElementProps } from '../../types'
import { TabHeaderWrapper } from './TabHeaderWrapper'

interface TabElementProps extends WeaverseElementProps {
  items: any[]
}

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

const Tab = forwardRef<HTMLDivElement, TabElementProps>((props, ref) => {
  const wvId = props['data-wv-id']
  const { items, children, ...rest } = props
  const defaultActive = (React.Children.toArray(children)?.[0] as any)?.props
    ?.id
  const [active, setActive] = useState<string | number | null>(defaultActive)
  const setOpenTab = (id: string | number) => {
    if (id === active) {
      setActive(null)
    } else {
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
  items: [
    {
      headerText: 'Tab 1',
    },
    {
      headerText: 'Tab 2',
    },
    {
      headerText: 'Tab 2',
    },
  ],
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
        backgroundColor: '#f0f2f3',
        padding: '10px 16px',
        cursor: 'pointer',
        '&.active': {
          backgroundColor: '#0F71FF',
          color: '#fff',
        },
      },
      // '.wv-tab-header': {
      //   borderRadius: 4,
      //   padding: 12,
      //   marginBottom: 4,
      //   border: '1px solid #76A9FA',
      //   '&.active': {
      //     color: 'blue',
      //   },
      //   '&.active + [data-wv-type="tab.content"]': {
      //     maxHeight: 'var(--max-height, inherit)',
      //   },
      // },
    },
  },
}

export default Tab
