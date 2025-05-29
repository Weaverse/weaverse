import type { ElementCSS } from '@weaverse/react'
import { forwardRef } from 'react'
import { Background } from '~/components/background'
import { Overlay } from '~/components/overlay'
import Placeholder from '~/components/placeholder'
import type { SlideProps } from '~/types/components'
import { slidePositionMap } from './position'

let Slide = forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  let {
    contentPosition,
    backgroundColor,
    backgroundImage,
    objectFit,
    objectPosition,
    enableOverlay,
    overlayOpacity,
    backgroundFit,
    backgroundPosition,
    children,
    ...rest
  } = props

  return (
    <div className="keen-slider__slide">
      <Background
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        backgroundFit={objectFit}
        backgroundPosition={objectPosition}
        className="slide-background"
      />
      <Overlay
        enableOverlay={enableOverlay}
        overlayOpacity={overlayOpacity}
        className="slide-overlay"
      />
      <div ref={ref} {...rest} style={slidePositionMap[contentPosition]}>
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
    maxWidth: '100%',
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
  objectFit: 'cover',
  objectPosition: 'center center',
  enableOverlay: false,
  overlayOpacity: 30,
}

export default Slide
