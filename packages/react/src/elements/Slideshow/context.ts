import { createContext, useContext } from 'react'

export let SlideshowContext = createContext<{
  animation: string
} | null>(null)

export let useSlideshowContext = () => {
  let context = useContext(SlideshowContext)
  if (context === null) {
    throw new Error(
      '`useSlideshowContext` must be used within a `SlideshowContext`'
    )
  }
  return context
}
