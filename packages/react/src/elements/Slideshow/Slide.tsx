import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import { Background } from '~/components/Background'
import { Overlay } from '~/components/Overlay'
import type { SlideProps } from '~/types'
import { slidePositionMap } from './position'

let Slide = forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  let {
    contentPosition,
    backgroundColor,
    backgroundImage,
    backgroundFit,
    backgroundPosition,
    enableOverlay,
    overlayOpacity,
    children,
    ...rest
  } = props
  let style = slidePositionMap[contentPosition]
  return (
    <div className="keen-slider__slide">
      <Background
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        backgroundFit={backgroundFit}
        backgroundPosition={backgroundPosition}
        className="slide-background"
      />
      <Overlay
        enableOverlay={enableOverlay}
        overlayOpacity={overlayOpacity}
        className="slide-overlay"
      />
      <div ref={ref} style={style} {...rest}>
        {/* @ts-ignore */}
        {children?.length ? children : 'Add element here'}
      </div>
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    position: 'relative',
    height: '100%',
    width: '1224px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '100px 20px',
  },
}

Slide.defaultProps = {
  contentPosition: 'center center',
  backgroundFit: 'cover',
  backgroundPosition: 'center center',
  enableOverlay: false,
  overlayOpacity: 30,
}

export default Slide
