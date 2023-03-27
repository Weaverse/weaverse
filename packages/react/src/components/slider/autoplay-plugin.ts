import type { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider/react.es'

export function AutoplayPlugin(changeSlidesEvery: number): KeenSliderPlugin {
  return (slider: KeenSliderInstance) => {
    let timeout: ReturnType<typeof setTimeout>
    let mouseOver = false
    function clearNextTimeout() {
      clearTimeout(timeout)
    }
    function nextTimeout() {
      clearTimeout(timeout)
      if (mouseOver) return
      timeout = setTimeout(() => {
        slider.next()
      }, changeSlidesEvery * 1000)
    }
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true
        clearNextTimeout()
      })
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false
        nextTimeout()
      })
      nextTimeout()
    })
    slider.on('dragStarted', clearNextTimeout)
    slider.on('animationEnded', nextTimeout)
    slider.on('updated', nextTimeout)
  }
}
