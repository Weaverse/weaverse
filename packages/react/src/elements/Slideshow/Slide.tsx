import type { ElementCSS } from '@weaverse/core'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Background } from '~/components/Background'
import { Overlay } from '~/components/Overlay'
import Placeholder from '~/components/Placeholder'
import type { SlideProps } from '~/types'
import { useSlideshowContext } from './context'
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
  let { animation } = useSlideshowContext()
  let className = clsx(
    animation === 'slide' ? 'keen-slider__slide' : 'fader__slide'
  )
  return (
    <div className={className}>
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
      <div ref={ref} style={slidePositionMap[contentPosition]} {...rest}>
        {children?.length ? (
          children
        ) : (
          <Placeholder element="Slide" className="wv-slide-placeholder">
            Drag and drop elements here
          </Placeholder>
        )}
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
    '.wv-slide-placeholder': {
      height: '200px',
      zIndex: 1,
    },
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
