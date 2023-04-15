import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import type { LayoutElementProps } from '~/types'
import { Background } from '~/components/background'
import { Overlay } from '~/components/overlay'

let Layout = forwardRef<HTMLDivElement, LayoutElementProps>((props, ref) => {
  let {
    children,
    rows,
    gap,
    rowSize,
    columns,
    contentSize,
    gridSize,
    backgroundColor,
    backgroundImage,
    objectFit,
    objectPosition,
    enableOverlay,
    overlayOpacity,
    ...rest
  } = props
  let style = {
    '--layout-content-width': '100vw',
    '--content-size': contentSize + 'px',
    '--grid-size': gridSize + 'px',
    '--rows': rows,
    '--columns': columns,
    '--gap': gap + 'px',
    '--row-size': rowSize + 'px',
    '--col-size':
      'calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))',
  } as React.CSSProperties

  return (
    <div ref={ref} {...rest} style={style}>
      <Background
        backgroundImage={backgroundImage}
        backgroundColor={backgroundColor}
        backgroundFit={objectFit}
        backgroundPosition={objectPosition}
      />
      <Overlay enableOverlay={enableOverlay} overlayOpacity={overlayOpacity} />
      <div data-layout-content>{children}</div>
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    position: 'relative',
    '> [data-layout-content]': {
      // paddingTop: 'var(--gap)',
      // paddingBottom: 'var(--gap)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
      gridTemplateColumns:
        'calc((var(--layout-content-width) - var(--content-size)) / 2) 1fr repeat(var(--columns), minmax(0, var(--col-size))) 1fr calc((var(--layout-content-width) - var(--content-size)) / 2)',
      gridAutoRows: 'var(--row-size)',
      gap: 'var(--gap)',
      maxWidth: 'var(--layout-content-width)',
    },
  },
  '@mobile': {
    padding: '0 16px',
    '> [data-layout-content]': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
}

Layout.defaultProps = {
  contentSize: 1600,
  gridSize: 1224,
  rows: 16,
  columns: 12,
  gap: 16,
  rowSize: 48,
  objectFit: 'cover',
  objectPosition: 'center center',
  enableOverlay: false,
  overlayOpacity: 30,
}

export default Layout
