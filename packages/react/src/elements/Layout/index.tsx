import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import type { LayoutElementProps } from '~/types'
import { Background } from './Background'
import { Overlay } from './Overlay'

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
        imgUrl={backgroundImage}
        bgColor={backgroundColor}
        objectFit={objectFit}
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
      paddingTop: 'var(--gap)',
      paddingBottom: 'var(--gap)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
      gridTemplateColumns:
        'calc((var(--layout-content-width) - var(--content-size)) / 2) 1fr repeat(var(--columns), minmax(0, var(--col-size))) 1fr calc((var(--layout-content-width) - var(--content-size)) / 2)',
      gridAutoRows: 'var(--row-size)',
      gap: 'var(--gap)',
      maxWidth: 'var(--layout-content-width)',
    },
    '.wv-layout-background': {
      display: 'block',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'var(--layout-bg-color)',
      img: {
        objectFit: 'var(--layout-bg-image-object-fit, cover)',
      },
    },
    '.wv-layout-overlay': {
      display: 'block',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, var(--layout-overlay-opacity, 0.5))',
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
}

export default Layout
