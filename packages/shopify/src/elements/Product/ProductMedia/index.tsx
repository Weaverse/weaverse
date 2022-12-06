import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { PRODUCT_IMAGE_PLACEHOLDER } from '~/constant'
import { ProductContext } from '~/context'
import type { ProductMediaProps, ProductMediaSize } from '~/types'
import { Arrows } from './Arrows'
import { Dots } from './Dots'
import { Image } from './Image'
import { MediaFullscreenSlider } from './MediaFullscreenSlider'
import { useMediaSlider } from './useMediaSlider'

let mediaSizesMap: Record<ProductMediaSize, string> = {
  small: '40%',
  medium: '50%',
  large: '60%',
}

let ProductMedia = forwardRef<HTMLDivElement, ProductMediaProps>(
  (props, ref) => {
    let { mediaSize, aspectRatio, fallbackImage, ...rest } = props
    let context = useContext(ProductContext)
    let [currentSlide, setCurrentSlide] = useState(0)
    let [created, setCreated] = useState(false)
    let [cssLoaded, setCssLoaded] = useState(false)
    let [ready, setReady] = useState(false)
    let [zoomed, setZoomed] = useState(false)

    let [sliderRef, thumbnailRef, instanceRef, thumbnailInstanceRef] =
      useMediaSlider({
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
        window.requestAnimationFrame(() => {
          let initialIndex = instanceRef?.current?.options?.initial || 0
          instanceRef?.current?.update(undefined, initialIndex)
          thumbnailInstanceRef?.current?.update(undefined, initialIndex)
          setReady(true)
        })
      }
    }, [mediaSize, aspectRatio, created, cssLoaded])

    if (context) {
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
          <div ref={ref} style={style} {...rest}>
            <div className="wv-product-image__single">
              <Image image={image} width={1000} onLoad={() => setReady(true)} />
            </div>
          </div>
        )
      }

      return (
        <div ref={ref} style={style} {...rest}>
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
                  onClick={() => setZoomed(true)}
                />
              ))}
            </div>
            {created && instanceRef?.current && (
              <Arrows currentSlide={currentSlide} instanceRef={instanceRef} />
            )}
            {created && instanceRef.current && (
              <Dots currentSlide={currentSlide} instanceRef={instanceRef} />
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
          <MediaFullscreenSlider
            open={zoomed}
            onOpenChange={setZoomed}
            images={images}
          />
        </div>
      )
    }
    return null
  }
)

ProductMedia.defaultProps = {
  mediaSize: 'medium',
  aspectRatio: 'auto',
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
    '.wv-product-media-fullscreen': {
      padding: '80px 120px',
      '.wv-modal-content': {
        height: '100%',
        '.wv-produt-media__fullscreen-slider': {
          height: '100%',
          '.keen-slider__slide': {
            minWidth: 'min(var(--media-aspect-ratio) * (100vh - 12rem), 60vw)',
            maxWidth: 'min(var(--media-aspect-ratio) * (100vh - 12rem), 60vw)',
            display: 'flex',
            alignItems: 'center',
            img: {
              aspectRatio: 'var(--media-aspect-ratio, auto)',
              width: '100%',
              cursor: 'pointer',
              objectFit: 'cover',
            },
          },
        },
      },
    },
  },
  '@mobile': {
    minWidth: '100%',
    maxWidth: '100%',
    paddingRight: '0px',
    marginBottom: '32px',
    '.wv-product-slider__wrapper': {
      '.wv-slider-arrow': {
        display: 'none',
      },
      '.wv-slider-dots': {
        display: 'flex',
      },
    },
    '.wv-thumbnail-slider': {
      display: 'none !important',
    },
    '.wv-product-media-fullscreen': {
      padding: '80px 10px',
    },
  },
}

export default ProductMedia
