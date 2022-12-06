import type { ElementCSS } from '@weaverse/core'
import type { CSSProperties } from 'react'
import React, { forwardRef } from 'react'
import type { LayoutElementProps, LayoutBackgroundProps } from '~/types'

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
      <LayoutBackground
        imgUrl={backgroundImage}
        bgColor={backgroundColor}
        objectFit={objectFit}
      />
      <div data-layout-content>{children}</div>
    </div>
  )
})

let LayoutBackground = (props: LayoutBackgroundProps) => {
  let { bgColor, imgUrl, objectFit } = props
  let style = {
    ['--bg-color']: bgColor,
    ['--object-fit']: objectFit,
    display: 'block',
  } as CSSProperties

  if (imgUrl || bgColor) {
    return (
      <div style={style} className="wv-layout-background">
        {imgUrl && (
          <img
            width="100%"
            height="100%"
            data-blink-src={imgUrl}
            alt="Section background"
          />
        )}
      </div>
    )
  }
  return null
}

export let css: ElementCSS = {
  '@desktop': {
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
  },
  '@mobile': {
    padding: '0 16px',
    '> [data-layout-content]': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
}

export let permanentCss = {
  '@desktop': {
    '.wv-layout-background': {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'var(--bg-color)',
    },
    img: {
      objectFit: 'var(--object-fit, cover)',
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
