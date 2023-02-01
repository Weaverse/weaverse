import { useEffect } from 'react'
import type { ProductContextType } from '~/types'

export function useMediaZoomInEffect(
  zoomed: boolean,
  context: ProductContextType
) {
  useEffect(() => {
    let productDetails = context?.formRef?.current?.closest(
      '[data-wv-type="product-details"]'
    )
    if (productDetails) {
      if (zoomed) {
        productDetails.classList.add('image-zoomed')
      } else {
        productDetails.classList.remove('image-zoomed')
      }
    }
  }, [zoomed, context])
}
