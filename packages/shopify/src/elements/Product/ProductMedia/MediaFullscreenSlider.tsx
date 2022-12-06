import { Components } from '@weaverse/react'
import { useKeenSlider } from 'keen-slider/react'
import React from 'react'
import type { MediaFullscreenSliderProps } from '~/types'
import { FullscreenSliderResizePlugin as ResizePlugin } from './ResizePlugin'

let { Modal, ModalContent } = Components.ModalComponents

export function MediaFullscreenSlider(props: MediaFullscreenSliderProps) {
  let { open, onOpenChange, images } = props
  let [sliderRef] = useKeenSlider<HTMLDivElement>(
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
