import React, { forwardRef, useContext } from 'react'
import Placeholder from '~/components/placeholder'
import { TabContext } from './index'
import type { GridContentElementProps } from '~/types'

interface TabContentElementProps extends GridContentElementProps {
  name: string
}

const TabContent = forwardRef<HTMLDivElement, TabContentElementProps>(
  (props, ref) => {
    const { active } = useContext(TabContext)
    const wvId = props['data-wv-id']
    const { rows, columns, gap, rowSize, children, ...rest } = props

    let style = {
      '--rows': rows,
      '--columns': columns,
      '--gap': gap + 'px',
      '--row-size': rowSize + 'px',
      '--col-size':
        'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
      '--max-height': rows * rowSize + gap * (rowSize - 1) + 'px',
      '--content-active': active === wvId ? 'grid' : 'none',
    } as React.CSSProperties

    return (
      <div ref={ref} {...rest} style={style}>
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <Placeholder element="Tab Content">
            Drag and drop an element here.
          </Placeholder>
        )}
      </div>
    )
  }
)

export let css = {
  '@desktop': {
    width: '100%',
    maxWidth: 'var(--grid-size)',
    display: 'var(--content-active, none)',
    gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
    gridTemplateColumns: 'repeat(var(--columns), minmax(0, var(--col-size)))',
    gap: 'var(--gap)',
    // overflow: 'hidden',
    // maxHeight: 0,
    // transition: 'all var(--transition-duration, 0.3s) ease-in-out',
    borderRadius: 4,
  },
}

TabContent.defaultProps = {
  rows: 3,
  columns: 12,
  gap: 4,
  rowSize: 48,
  name: 'Tab header',
}

export default TabContent
