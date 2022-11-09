import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { ProductContext } from '~/context'
import type { ProductMediaProps, ProductMediaSize } from '~/types'
import { Arrows } from './Arrows'
import { Dots } from './Dots'
import { SlideImage } from './SlideImage'
import { useProductImageSlider } from './useProductImageSlider'

let mediaSizesMap: Record<ProductMediaSize, string> = {
  small: '40%',
  medium: '50%',
  large: '60%',
}

let ProductMedia = forwardRef<HTMLDivElement, ProductMediaProps>(
  (props, ref) => {
    let { mediaSize, aspectRatio, ...rest } = props
    let context = useContext(ProductContext)
    let [currentSlide, setCurrentSlide] = React.useState(0)
    let [created, setCreated] = useState(false)
    let [cssLoaded, setCssLoaded] = useState(false)
    let [opacity, setOpacity] = useState(0)

    let [sliderRef, thumbnailRef, instanceRef, thumbnailInstanceRef] =
      useProductImageSlider({
        context,
        onSlideChanged: (slider) => {
          setCurrentSlide(slider.track.details.rel)
        },
        onSliderCreated: () => {
          setCreated(true)
        },
      })

    useEffect(() => {
      if (created && cssLoaded) {
        instanceRef?.current?.update()
        thumbnailInstanceRef?.current?.update()
        setOpacity(1)
      }
    }, [mediaSize, aspectRatio, created, cssLoaded])

    if (context) {
      let { images } = context.product
      let style = {
        '--media-width': mediaSizesMap[mediaSize],
        '--media-aspect-ratio': aspectRatio,
        '--media-opacity': opacity,
      } as React.CSSProperties

      return (
        <div ref={ref} style={style} {...rest}>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
            onLoad={() => setCssLoaded(true)}
          />
          <div className="wv-product-slider__wrapper">
            <div ref={sliderRef} className="keen-slider wv-product-slider">
              {images.map((image) => {
                let { id, src, alt = '' } = image
                return (
                  <React.Fragment key={id}>
                    <SlideImage
                      image={image}
                      className="keen-slider__slide wv-product-slider__slide"
                    />
                    <noscript>
                      {`<img src="${src}&width=1000" alt="${alt || ''}"/>`}
                    </noscript>
                  </React.Fragment>
                )
              })}
            </div>
            {created && instanceRef?.current && (
              <Arrows currentSlide={currentSlide} instanceRef={instanceRef} />
            )}
            {created && instanceRef.current && (
              <Dots currentSlide={currentSlide} instanceRef={instanceRef} />
            )}
          </div>
          <div ref={thumbnailRef} className="keen-slider wv-thumbnail-slider">
            {images.map((image) => {
              let { id, src, alt = '' } = image
              return (
                <React.Fragment key={id}>
                  <SlideImage
                    image={image}
                    className="keen-slider__slide wv-thumbnail__slide"
                  />
                  <noscript>
                    {`<img src="${src}&width=480" alt="${alt || ''}"/>`}
                  </noscript>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }
)

ProductMedia.defaultProps = {
  mediaSize: 'medium',
  aspectRatio: '1 / 1',
}

export let css: ElementCSS = {
  '@desktop': {
    width: 'var(--media-width, 50%)',
    paddingRight: '16px',
    transition: 'opacity 0.3s ease-in-out',
    opacity: 'var(--media-opacity, 0)',
    '.wv-product-slider__wrapper': {
      position: 'relative',
    },
    '.wv-product-slider': {
      aspectRatio: 'var(--media-aspect-ratio, 1/1)',
    },
    '.wv-product-slider__slide': {
      cursor: 'pointer',
      height: '100%',
      objectFit: 'cover',
    },
    '.wv-slider-arrow': {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '44px',
      height: '44px',
      padding: '8px',
      color: '#191919',
      backgroundColor: '#f2f2f2',
      textAlign: 'center',
      transition: 'all 0.2s ease-in-out',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#191919',
        color: '#f2f2f2',
      },
      svg: {
        verticalAlign: 'middle',
        width: '22px',
        height: '22px',
      },
      '&.arrow--left': {
        left: '10px',
      },
      '&.arrow--right': {
        right: '10px',
      },
      '&.arrow--disabled': {
        opacity: 0.5,
      },
    },
    '.wv-slider-dots': {
      display: 'none',
      padding: '10px 0',
      justifyContent: 'center',
      '.dot': {
        width: '9px',
        height: '9px',
        padding: '0',
        margin: '0 5px',
        borderRadius: '50%',
        background: '#2125291a',
        transition: 'all 0.2s ease-in-out',
        '&.dot--active': {
          background: '#212529',
        },
      },
    },
    '.wv-thumbnail-slider': {
      marginTop: '10px',
    },
    '.wv-thumbnail__slide': {
      aspectRatio: 'var(--media-aspect-ratio, 1/1)',
      height: '100%',
      cursor: 'pointer',
      padding: '6px',
      border: '1px solid transparent',
      '&.active': {
        border: '1px solid #000',
      },
    },
  },
  '@mobile': {
    width: '100%',
    paddingRight: '0px',
    marginBottom: '32px',
    '.wv-thumbnail__slide': {
      padding: '4px',
    },
    '.wv-slider-arrow': {
      display: 'none',
    },
    '.wv-slider-dots': {
      display: 'flex',
    },
    '.wv-thumbnail-slider': {
      display: 'none !important',
    },
  },
}

export default ProductMedia
