import { Theme } from "@artsy/palette-mobile"
import { useEffect } from "react"
import { Appearance, StatusBar } from "react-native"
import { GlobalStore } from "system/store/GlobalStore"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const ThemeProvider: React.FC = ({ children }) => {
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      GlobalStore.actions.devicePrefs.setSystemColorScheme(colorScheme ?? "light")
    })
    return () => subscription.remove()
  }, [])

  const isDarkMode = useIsDarkMode()
  const theme = isDarkMode ? "v3dark" : "v3light"

  return (
    <Theme theme={theme}>
      {children}

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "black" : "background"}
      />
    </Theme>
  )
}
