import type { KeenSliderPlugin } from 'keen-slider/react'

export let ResizePlugin: KeenSliderPlugin = (slider) => {
  let observer = new ResizeObserver(() => slider.update())
  slider.on('created', () => {
    observer.observe(slider.container)
  })
  slider.on('destroyed', () => {
    observer.unobserve(slider.container)
  })
}
