import { useKeenSlider } from 'keen-slider/react'
import { useEffect } from 'react'
import type { ProductContextType } from '~/types'
import { ThumbnailPlugin } from './ThumbnailPlugin'

export function useProductImageSlider(context: ProductContextType | null) {
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
      let { selectedVariant } = context
      if (selectedVariant) {
        let { featured_media } = selectedVariant
        if (featured_media) {
          if (instanceRef.current) {
            instanceRef.current.moveToIdx(featured_media.position - 1)
          }
        }
      }
    }
  }, [context])

  return [sliderRef, thumbnailRef] as const
}
