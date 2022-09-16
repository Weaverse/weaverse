import React, { createContext, forwardRef, useState } from 'react'
import type { WeaverseElementProps } from '~/types'
import { TabHeaderWrapper } from './TabHeaderWrapper'

interface TabProps extends WeaverseElementProps {
  fullWidthTabHeader: boolean
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

const Tab = forwardRef<HTMLDivElement, TabProps>((props, ref) => {
  const wvId = props['data-wv-id']
  const { fullWidthTabHeader, children, ...rest } = props
  const defaultActive = (React.Children.toArray(children)?.[0] as any)?.props
    ?.id
  const [active, setActive] = useState<string | number | null>(defaultActive)
  const setOpenTab = (id: string | number) => {
    if (id !== active) {
      setActive(id)
    }
  }
  return (
    <div
      ref={ref}
      {...rest}
      style={
        {
          '--tab-width': fullWidthTabHeader ? '100%' : 'auto',
        } as React.CSSProperties
      }
    >
      <TabContext.Provider value={{ active, setActive: setOpenTab }}>
        <TabHeaderWrapper wvId={wvId} />
        {children}
      </TabContext.Provider>
    </div>
  )
})

export let css = {
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
      textAlign: 'center',
      width: 'var(--tab-width, auto)',
      '&.active': {
        backgroundColor: '#E4E7EB',
      },
    },
  },
}

Tab.defaultProps = {
  fullWidthTabHeader: false,
}

export default Tab
