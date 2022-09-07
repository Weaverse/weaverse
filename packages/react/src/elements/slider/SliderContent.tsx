import React, { forwardRef, useContext } from 'react'
import Placeholder from '~/elements/shared/Placeholder'
import type { GridContentElementProps } from '~/types'
import { WeaverseContext } from '~/context'

interface SliderContentElementProps extends GridContentElementProps {
  name: string
  mediaUrl: string
  openInNewTab: boolean
  targetLink: string
}

const SliderContent = forwardRef<HTMLDivElement, SliderContentElementProps>(
  (props, ref) => {
    const { isDesignMode } = useContext(WeaverseContext)
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
          <Placeholder element="Slider Content">
            Drag and drop an element here.
          </Placeholder>
        )}
      </div>
    )
  }
)

SliderContent.defaultProps = {
  name: 'Slider',
  mediaUrl: '',
  openInNewTab: false,
  targetLink: 'https://myshop.com',
  rows: 4,
  columns: 12,
  gap: 4,
  rowSize: 48,
  css: {
    '@desktop': {
      width: '100%',
      maxWidth: 'var(--grid-size)',
      display: 'grid',
      gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
      gridTemplateColumns: 'repeat(var(--columns), minmax(0, var(--col-size)))',
      gap: 'var(--gap)',
      borderRadius: 4,
      backgroundImage: 'var(--background-url, none)',
    },
  },
}

export default SliderContent
