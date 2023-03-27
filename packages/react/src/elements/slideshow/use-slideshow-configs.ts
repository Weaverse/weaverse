import { useKeenSlider } from 'keen-slider/react'
import React, { useContext, useEffect, useState } from 'react'
import { AutoplayPlugin } from '~/components/slider/autoplay-plugin'
import { ResizePlugin } from '~/components/slider/resize-plugin'
import { WeaverseContext } from '~/context'
import type { SlideshowProps } from '~/types'
import { loadCSS } from '~/utils/css'

export function useSlideshowConfigs(props: SlideshowProps) {
  let {
    animation,
    slidesPerView,
    loop,
    autoRotate,
    changeSlidesEvery,
    children,
  } = props

  let { isDesignMode, isPreviewMode } = useContext(WeaverseContext)
  let [opacities, setOpacities] = React.useState<number[]>([])
  let [cssLoaded, setCssLoaded] = useState(false)
  let [created, setCreated] = useState(false)
  let [ready, setReady] = useState(false)
  let [currentSlide, setCurrentSlide] = useState(0)

  let sliderPlugins = [ResizePlugin]
  if (autoRotate && (isPreviewMode || !isDesignMode)) {
    sliderPlugins.push(AutoplayPlugin(changeSlidesEvery))
  }
  let [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slides:
        animation === 'fade'
          ? React.Children.count(children)
          : { perView: slidesPerView, number: React.Children.count(children) },
      drag: isPreviewMode || !isDesignMode,
      loop,
      selector: animation === 'fade' ? null : '.keen-slider__slide',
      created: (slider) => {
        setCreated(true)
        if (isDesignMode) {
          // Save instance to window so we can access it inside the editor
          let slideshowElement = slider.container.closest(
            '[data-wv-type="slideshow"]'
          )
          let elementId = slideshowElement?.getAttribute('data-wv-id')
          if (elementId) {
            window.weaverseSlideshowInstances = {
              [elementId]: slider,
            }
          }
        }
      },
      slideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel)
      },
      detailsChanged: (slider) => {
        let newOpacities = slider.track?.details?.slides?.map(
          (slide) => slide.portion
        )
        setOpacities(newOpacities)
      },
    },
    sliderPlugins
  )

  useEffect(() => {
    loadCSS({
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css',
    }).then(() => setCssLoaded(true))
  }, [])

  useEffect(() => {
    if (created && cssLoaded) {
      setReady(true)
    }
  }, [created, cssLoaded])

  return {
    sliderRef,
    instanceRef,
    currentSlide,
    opacities,
    ready,
    created,
  }
}
