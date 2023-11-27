import type { ElementCSS } from '@weaverse/react'
import { useKeenSlider } from 'keen-slider/react'
import React from 'react'

import { Components } from '~/components'
import type { MediaFullscreenSliderProps } from '~/types'

let { Modal, ModalContent } = Components.ModalComponents

export function MediaFullscreenSlider(props: MediaFullscreenSliderProps) {
  let { open, onOpenChange, images } = props
  let [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 'auto', spacing: 20 },
    breakpoints: {
      '(max-width: 768px)': {
        slides: { perView: 1, spacing: 0 },
      },
    },
  })

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="fullscreen" className="wv-product-media-fullscreen">
        <div
          ref={sliderRef}
          className="keen-slider wv-produt-media__fullscreen-slider"
        >
          {images.map((image) => (
            <div key={image.id} className="keen-slider__slide">
              <img src={image.src} alt={image.alt || ''} loading="lazy" />
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  )
}

export let css: ElementCSS = {
  '@desktop': {
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
    '.wv-product-media-fullscreen': {
      padding: '80px 10px',
    },
  },
}
