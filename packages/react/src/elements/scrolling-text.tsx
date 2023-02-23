import type { ElementCSS } from '@weaverse/core'
import * as React from 'react'
import type { ScrollingTextElementProps } from '~/types'

const ScrollingText = React.forwardRef<
  HTMLDivElement,
  ScrollingTextElementProps
>((props, ref) => {
  let { children, value, gap, speed, pauseOnHover, ...rest } = props
  let [animationPlayState, setAnimationPlayState] = React.useState<
    'running' | 'paused'
  >('running')
  let style = {
    '--move-speed': `${speed}s`,
    '--gap': `${gap}px`,
    '--animation-play-state': animationPlayState,
  } as React.CSSProperties

  let events = {}
  if (pauseOnHover) {
    events = {
      onMouseEnter: () => setAnimationPlayState('paused'),
      onMouseLeave: () => setAnimationPlayState('running'),
    }
  }

  return (
    <div ref={ref} {...rest}>
      <div className="wv-scrolling-text__container" style={style} {...events}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="wv-text-content"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ))}
      </div>
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    padding: '10px',
    '.wv-scrolling-text__container': {
      visibility: 'visible',
      whiteSpace: 'nowrap',
      display: 'flex',
      animation: 'wv-scrolling-text var(--move-speed, 100s) linear infinite',
      gap: 'var(--gap, 40px)',
      animationPlayState: 'var(--animation-play-state, running)',
      '.wv-text-content': {
        width: '100%',
        height: 'fit-content',
        '> p, > h1, > h2, > h3, > h4, > h5, > h6': {
          all: 'inherit',
          margin: '0',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          width: 'auto',
          height: 'auto',
        },
      },
    },
  },
}

ScrollingText.defaultProps = {
  value: '<p>The quick brown fox jumps over the lazy dog</p>',
  gap: 40,
  speed: 200,
  pauseOnHover: true,
}

export default ScrollingText
