import React, { useEffect } from 'react'
import type { ProductContextType } from '~/types'
import { getVariantOptions } from '~/utils'

export function useOptions(context: ProductContextType | null) {
  let [selectedOptions, setSelectedOptions] = React.useState<string[]>(() => {
    if (context?.selectedVariant) {
      return getVariantOptions(context.selectedVariant)
    }
    return []
  })

  useEffect(() => {
    if (context?.selectedVariant) {
      setSelectedOptions(getVariantOptions(context.selectedVariant))
    }
  }, [context?.selectedVariant])

  return [selectedOptions, setSelectedOptions] as const
}
