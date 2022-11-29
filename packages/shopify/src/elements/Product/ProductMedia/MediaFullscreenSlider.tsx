import { Components } from '@weaverse/react'
import { useKeenSlider } from 'keen-slider/react'
import React from 'react'
import type { MediaFullscreenSliderProps } from '~/types'
import { ResizePlugin } from './ResizePlugin'

let { Modal, ModalContent } = Components.ModalComponents

export function MediaFullscreenSlider(props: MediaFullscreenSliderProps) {
  let { open, onOpenChange, images } = props
  let [fullscreenSliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      mode: 'snap',
      rtl: false,
      slides: { perView: 'auto', spacing: 20 },
    },
    [ResizePlugin]
  )

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="fullscreen" className="wv-product-media-fullscreen">
        <div
          ref={fullscreenSliderRef}
          className="keen-slider wv-fullscreen-media-slider"
        >
          {images.map((image) => (
            <div
              key={image.id}
              style={{
                minWidth:
                  'min(var(--media-aspect-ratio) * (100vh - 12rem), 60vw)',
                maxWidth:
                  'min(var(--media-aspect-ratio) * (100vh - 12rem), 60vw)',
              }}
              className="keen-slider__slide wv-fullscreen-slide"
            >
              <img src={image.src} alt={image.alt || ''} loading="lazy" />
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  )
}
