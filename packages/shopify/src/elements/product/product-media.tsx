import type { ElementCSS } from '@weaverse/react'
import type { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'
import type { MutableRefObject } from 'react'
import { useEffect } from 'react'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { ProductMediaProps, ProductMediaSize } from '~/types'

let mediaSizesMap: Record<ProductMediaSize, string> = {
  small: '40%',
  medium: '50%',
  large: '60%',
}

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active')
      })
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add('active')
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx)
        })
      })
    }

    slider.on('created', () => {
      if (!mainRef.current) return
      addActive(slider.track.details.rel)
      addClickEvents()
      mainRef.current.on('animationStarted', (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(next)
      })
    })
  }
}

let ProductMedia = forwardRef<HTMLDivElement, ProductMediaProps>(
  (props, ref) => {
    let { mediaSize, aspectRatio, ...rest } = props
    let context = useContext(ProductContext)
    let [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
      initial: 0,
    })
    let [thumbnailRef] = useKeenSlider<HTMLDivElement>(
      {
        initial: 0,
        slides: {
          perView: 5,
          spacing: 10,
        },
      },
      [ThumbnailPlugin(instanceRef)]
    )

    useEffect(() => {
      if (context) {
        let { product, selectedVariant } = context
        if (selectedVariant) {
          let { featured_media } = selectedVariant
          console.log('👉 --------> - featured_media', featured_media)
          if (featured_media) {
            if (instanceRef.current) {
              instanceRef.current.moveToIdx(featured_media.position - 1)
            }
          }
        }
      }
    }, [context])

    if (context) {
      let { product, selectedVariant } = context
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
            {product.images.map((image) => {
              return (
                <img
                  key={image.id}
                  className="keen-slider__slide wv-product-slider__slide"
                  srcSet={`
                    ${image.src}&width=288 288w,
                    ${image.src}&width=576 576w,
                    ${image.src}&width=550 550w,
                    ${image.src} 1000w
                  `}
                  src={`${image.src}&crop=center&height=550&width=550`}
                  sizes="(min-width: 1200px) calc((1200px - 10rem) / 2), (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)"
                  loading="lazy"
                  width={image.width}
                  height={image.height}
                  alt={image.alt || product.title}
                />
              )
            })}
          </div>
          <div ref={thumbnailRef} className="keen-slider wv-thumbnail-slider">
            {product.images.map((image) => {
              return (
                <img
                  key={image.id}
                  className="keen-slider__slide wv-thumbnail__slide"
                  srcSet={`
                    ${image.src}&width=288 288w,
                    ${image.src}&width=576 576w,
                    ${image.src}&width=550 550w,
                    ${image.src} 1000w
                  `}
                  src={`${image.src}&crop=center&height=550&width=550`}
                  sizes="(min-width: 1200px) calc((1200px - 10rem) / 2), (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)"
                  loading="lazy"
                  width={image.width}
                  height={image.height}
                  alt={image.alt || product.title}
                />
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
      '.wv-product-slider__slide': {
        cursor: 'pointer',
        height: '100%',
        objectFit: 'cover',
      },
    },
    '.wv-thumbnail-slider': {
      marginTop: '10px',
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
  },
  '@mobile': {
    width: '100%',
    paddingRight: '0px',
    marginBottom: '32px',
    '.wv-thumbnail-slider': {
      '.wv-thumbnail__slide': {
        padding: '4px',
      },
    },
  },
}

export default ProductMedia
