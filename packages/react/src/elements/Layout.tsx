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
    gridSize,
    backgroundColor,
    backgroundImage,
    objectFit,
    ...rest
  } = props
  let style = {
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
  } as CSSProperties

  return imgUrl || bgColor ? (
    <div data-wv-bg style={style}>
      {imgUrl && (
        <img
          width="100%"
          height="100%"
          data-blink-src={imgUrl}
          alt="wv-layout-background"
        />
      )}
    </div>
  ) : null
}

export let css = {
  '@desktop': {
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: 'var(--gap)',
    paddingRight: 'var(--gap)',
    '> [data-layout-content]': {
      margin: '0 auto',
      display: 'grid !important',
      gridTemplateRows: 'repeat(var(--rows), var(--row-size))',
      gridTemplateColumns: 'repeat(var(--columns), minmax(0, var(--col-size)))',
      gap: 'var(--gap)',
      maxWidth: 'var(--grid-size)',
    },
  },
  '@mobile': {
    padding: '0 16px',
    '> [data-layout-content]': {
      display: 'flex !important',
      flexDirection: 'column',
    },
  },
}

export let permanentCss = {
  '@desktop': {
    '[data-wv-bg]': {
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
  gridSize: 1224,
  rows: 12,
  columns: 12,
  gap: 16,
  rowSize: 48,
}

export default Layout
