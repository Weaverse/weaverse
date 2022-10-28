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
      let { selectedVariant, product } = context
      if (selectedVariant) {
        let newMediaIndex = -1
        let { featured_media, image_id } = selectedVariant
        if (featured_media) {
          newMediaIndex = featured_media.position - 1
        } else if (image_id) {
          let image = product.images.find((image) => image.id === image_id)
          if (image) {
            newMediaIndex = image.position - 1
          }
        }
        if (newMediaIndex >= 0 && instanceRef.current) {
          instanceRef.current.moveToIdx(newMediaIndex)
        }
      }
    }
  }, [context])

  return [sliderRef, thumbnailRef] as const
}
