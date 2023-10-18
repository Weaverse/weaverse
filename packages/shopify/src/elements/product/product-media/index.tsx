import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useEffect, useState } from 'react'
import { PRODUCT_IMAGE_PLACEHOLDER } from '~/constant'
import { useProductContext } from '~/hooks/use-product-context'
import type { ProductMediaProps, ProductMediaSize } from '~/types'
import { Image } from './image'
import { SliderComponents } from '~/components'
import {
  css as fullscreenSliderCss,
  MediaFullscreenSlider,
} from './media-fullscreen-slider'
import { useMediaSlider } from './use-media-slider'
import { useMediaZoomInEffect } from './use-media-zoom-in-effect'

let mediaSizesMap: Record<ProductMediaSize, string> = {
  small: '40%',
  medium: '50%',
  large: '60%',
}
let { Arrows, Dots, ResizePlugin } = SliderComponents

let ProductMedia = forwardRef<HTMLDivElement, ProductMediaProps>(
  (props, ref) => {
    let {
      mediaSize,
      aspectRatio,
      fallbackImage,
      allowFullscreen,
      thumbnailSlidePerView,
      ...rest
    } = props
    let context = useProductContext()
    let [currentSlide, setCurrentSlide] = useState(0)
    let [created, setCreated] = useState(false)
    let [cssLoaded, setCssLoaded] = useState(false)
    let [ready, setReady] = useState(false)
    let [zoomed, setZoomed] = useState(false)

    useMediaZoomInEffect(zoomed, context)

    let [sliderRef, thumbnailRef, instanceRef, thumbnailInstanceRef] =
      useMediaSlider({
        context,
        thumbnailSlidePerView,
        onSlideChanged: (slider) => {
          setCurrentSlide(slider.track.details.rel)
        },
        onSliderCreated: () => {
          setCreated(true)
        },
        ResizePlugin,
      })

    useEffect(() => {
      if (created && cssLoaded) {
        window.requestAnimationFrame(() => {
          let initialIndex = instanceRef?.current?.options?.initial || 0
          instanceRef?.current?.update(undefined, initialIndex)
          thumbnailInstanceRef?.current?.update(undefined, initialIndex)
          setReady(true)
        })
      }
    }, [mediaSize, aspectRatio, created, cssLoaded])

    let { images, aspect_ratio } = context.product
    let style = {
      '--media-width': mediaSizesMap[mediaSize],
      '--media-aspect-ratio':
        aspectRatio === 'auto' ? aspect_ratio || 'auto' : aspectRatio,
      '--media-opacity': ready ? 1 : 0,
    } as React.CSSProperties

    if (images.length <= 1) {
      let image = images[0] || {
        src: fallbackImage || PRODUCT_IMAGE_PLACEHOLDER,
        alt: 'Product media placeholder',
        width: 1000,
        height: 1000,
      }
      return (
        <div ref={ref} {...rest} style={style}>
          <div className="wv-product-image__single">
            <Image image={image} width={1000} onLoad={() => setReady(true)} />
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} {...rest} style={style}>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
          onLoad={() => setCssLoaded(true)}
        />
        <div className="wv-product-slider__wrapper">
          <div ref={sliderRef} className="keen-slider wv-product-slider">
            {images.map((image) => (
              <Image
                key={image.id}
                image={image}
                width={1000}
                className="keen-slider__slide wv-product-slider__slide"
                onClick={() => allowFullscreen && setZoomed(true)}
              />
            ))}
          </div>
          {created && instanceRef?.current && (
            <Arrows
              currentSlide={currentSlide}
              instanceRef={instanceRef}
              offset={10}
              icon="arrow"
              className="wv-pmedia-slider__arrows"
            />
          )}
          {created && instanceRef.current && (
            <Dots
              currentSlide={currentSlide}
              instanceRef={instanceRef}
              color="dark"
              className="wv-pmedia-slider__dots"
            />
          )}
        </div>
        <div ref={thumbnailRef} className="keen-slider wv-thumbnail-slider">
          {images.map((image) => (
            <Image
              key={image.id}
              image={image}
              width={480}
              className="keen-slider__slide wv-thumbnail__slide"
            />
          ))}
        </div>
        {allowFullscreen && (
          <MediaFullscreenSlider
            open={zoomed}
            onOpenChange={setZoomed}
            images={images}
          />
        )}
      </div>
    )
  },
)

ProductMedia.defaultProps = {
  mediaSize: 'medium',
  aspectRatio: 'auto',
  allowFullscreen: true,
  thumbnailSlidePerView: 6,
}

export let css: ElementCSS = {
  '@desktop': {
    minWidth: 'var(--media-width, 50%)',
    maxWidth: 'var(--media-width, 50%)',
    paddingRight: '16px',
    transition: 'opacity 0.3s ease-in-out',
    opacity: 'var(--media-opacity, 0)',
    '.wv-product-image__single': {
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      img: {
        aspectRatio: 'var(--media-aspect-ratio, auto)',
        height: '100%',
        maxWidth: '100%',
        cursor: 'pointer',
        objectFit: 'cover',
      },
    },
    '.wv-product-slider__wrapper': {
      position: 'relative',
      '.wv-product-slider': {
        aspectRatio: 'var(--media-aspect-ratio, auto)',
        '.wv-product-slider__slide': {
          cursor: 'pointer',
          height: '100%',
          objectFit: 'cover',
        },
      },
      '.wv-pmedia-slider__dots': {
        display: 'none',
      },
    },
    '.wv-thumbnail-slider': {
      marginTop: '10px',
      '.wv-thumbnail__slide': {
        aspectRatio: 'var(--media-aspect-ratio, auto)',
        height: '100%',
        objectFit: 'cover',
        cursor: 'pointer',
        padding: '6px',
        border: '1px solid transparent',
        '&.active': {
          border: '1px solid #000',
        },
      },
    },
    ...fullscreenSliderCss['@desktop'],
  },
  '@mobile': {
    minWidth: '100%',
    maxWidth: '100%',
    paddingRight: '0px',
    marginBottom: '32px',
    '.wv-product-slider__wrapper': {
      '.wv-pmedia-slider__dots': {
        display: 'flex',
      },
    },
    '.wv-thumbnail-slider': {
      display: 'none !important',
    },
    ...fullscreenSliderCss['@mobile'],
  },
}

export default ProductMedia
