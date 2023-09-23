import { useContext } from 'react'
import { ThemeProvider } from '~/context'

export function useThemeContext() {
  let themeContext = useContext(ThemeProvider)
  if (!themeContext) {
    throw new Error(
      `useThemeContext must be used within a ThemeProvider. Make sure to wrap your app in the withWeaverse HoC.`,
    )
  }
  return themeContext
}
