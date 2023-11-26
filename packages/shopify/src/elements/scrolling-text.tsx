import type { ElementCSS } from '@weaverse/react'
import type { CSSProperties } from 'react'
import React, { useState } from 'react'

import type { ScrollingTextElementProps } from '~/types/components'

type AnimationPlayState = 'running' | 'paused'

const ScrollingText = React.forwardRef<
  HTMLDivElement,
  ScrollingTextElementProps
>((props, ref) => {
  let { children, value, gap, speed, pauseOnHover, ...rest } = props
  let [playState, setPlayState] = useState<AnimationPlayState>('running')
  let style = {
    '--gap': `${gap}px`,
    '--speed': `${speed}s`,
    '--play-state': playState,
  } as CSSProperties

  let events = {}
  if (pauseOnHover) {
    events = {
      onMouseEnter: () => setPlayState('paused'),
      onMouseLeave: () => setPlayState('running'),
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
    overflow: 'hidden',
    '.wv-scrolling-text__container': {
      visibility: 'visible',
      whiteSpace: 'nowrap',
      display: 'flex',
      gap: 'var(--gap, 40px)',
      animation: 'wv-scrolling-text var(--speed, 100s) linear infinite',
      animationPlayState: 'var(--play-state, running)',
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
