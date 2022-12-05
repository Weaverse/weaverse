import { useContext } from 'react'
import { ProductContext } from '~/context'

export function useProductContext() {
  let context = useContext(ProductContext)
  if (!context) {
    throw new Error('`useProductContext` must be used within a ProductProvider')
  }
  return context
}
