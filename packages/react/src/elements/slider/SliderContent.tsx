import React, { forwardRef, useContext } from 'react'
import Placeholder from '../shared/Placeholder'
import { SliderContext } from './index'
import type { GridContentElementProps } from '../../types'
import { WeaverseContext } from '../../context'

interface SliderContentElementProps extends GridContentElementProps {
  mediaUrl: string
  openInNewTab: boolean
  targetLink: string
}

const SliderContent = forwardRef<HTMLDivElement, SliderContentElementProps>(
  (props, ref) => {
    const { active } = useContext(SliderContext)
    const { isDesignMode } = useContext(WeaverseContext)
    const wvId = props['data-wv-id']
    const {
      mediaUrl,
      targetLink,
      openInNewTab,
      rows,
      columns,
      gap,
      rowSize,
      children,
      ...rest
    } = props
    let style = {
      '--rows': rows,
      '--columns': columns,
      '--gap': gap + 'px',
      '--row-size': rowSize + 'px',
      '--col-size':
        'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
      '--max-height': rows * rowSize + gap * (rowSize - 1) + 'px',
      '--content-active': active === wvId ? 'grid' : 'none',
      '--background-url': `url(${mediaUrl}`,
    } as React.CSSProperties
    const handleClick = () => {
      if (!isDesignMode && targetLink) {
        window.open(targetLink, openInNewTab ? '_blank' : '_self')
      }
    }
    return (
      <div {...rest} style={style} onClick={handleClick}>
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
  mediaUrl:
    'https://i.pinimg.com/originals/6c/2f/f1/6c2ff122b867292548328c26749e6cca.jpg',
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
      backgroundImage: 'var(--background-url, none)',
    },
  },
}

export default SliderContent
