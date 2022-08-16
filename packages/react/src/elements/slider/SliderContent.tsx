import React, { forwardRef, useContext } from 'react'
import Placeholder from '../shared/Placeholder'
import { SliderContext } from './index'
import type { GridContentElementProps } from '../../types'

interface SliderContentElementProps extends GridContentElementProps {
  mediaUrl: string
  openInNewTab: boolean
  targetLink: string
}

const SliderContent = forwardRef<HTMLDivElement, SliderContentElementProps>(
  (props, ref) => {
    const { active } = useContext(SliderContext)
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
      <div {...rest} style={style}>
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <Placeholder element="Slider">Slider Content</Placeholder>
        )}
      </div>
    )
  }
)

SliderContent.defaultProps = {
  mediaUrl: '',
  openInNewTab: false,
  targetLink: 'https://myshop.com',
  rows: 2,
  columns: 12,
  gap: 4,
  rowSize: 48,
  css: {
    '@desktop': {
      width: '100%',
      maxWidth: 'var(--grid-size)',
      display: 'var(--content-active, none)',
      gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
      gridTemplateColumns: 'repeat(var(--columns), minmax(0, var(--col-size)))',
      gap: 'var(--gap)',
      // transition: 'all var(--transition-duration, 0.3s) ease-in-out',
      borderRadius: 4,
    },
  },
}

export default SliderContent
