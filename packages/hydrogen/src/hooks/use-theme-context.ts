import { useContext } from 'react'

import { ThemeProvider } from '~/context'
import { ThemeSettingsStore } from '~/hooks/use-theme-settings'

export function useThemeContext() {
  let themeContext = useContext(ThemeProvider)
  return themeContext || new ThemeSettingsStore({ theme: {} })
}
