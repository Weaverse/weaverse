import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductMediaProps, ProductMediaSize } from '~/types'
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
    let [sliderRef, thumbnailRef] = useProductImageSlider(context)

    if (context) {
      let { images } = context.product
      let style = {
        '--product-media-width': mediaSizesMap[mediaSize],
        '--media-aspect-ratio': aspectRatio,
      } as React.CSSProperties

      return (
        <div ref={ref} style={style} {...rest}>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
          />
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
    width: 'var(--product-media-width, 50%)',
    paddingRight: '16px',
    '.wv-product-slider': {
      aspectRatio: 'var(--media-aspect-ratio, 1/1)',
    },
    '.wv-product-slider__slide': {
      cursor: 'pointer',
      height: '100%',
      objectFit: 'cover',
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
      boxSizing: 'content-box',
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
  },
}

export default ProductMedia
