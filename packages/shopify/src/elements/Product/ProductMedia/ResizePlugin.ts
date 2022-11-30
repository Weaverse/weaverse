import type { KeenSliderPlugin } from 'keen-slider/react'

export let MainSliderResizePlugin: KeenSliderPlugin = (slider) => {
  let observer = new ResizeObserver(() => slider.update())
  slider.on('created', () => {
    observer.observe(slider.container)
  })
  slider.on('destroyed', () => {
    observer.unobserve(slider.container)
  })
}

export let FullscreenSliderResizePlugin: KeenSliderPlugin = (slider) => {
  let observer = new ResizeObserver(function (entries) {
    for (let entry of entries) {
      if (entry.contentRect.width < 768) {
        slider.update({ slides: { perView: 1, spacing: 0 } })
      } else {
        slider.update({ slides: { perView: 'auto', spacing: 20 } })
      }
    }
  })

  slider.on('created', () => {
    observer.observe(slider.container)
  })
  slider.on('destroyed', () => {
    observer.unobserve(slider.container)
  })
}
