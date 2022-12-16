import { Theme, _test_THEMES } from "@artsy/palette-mobile"
import { useEffect } from "react"
import { Appearance, StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayProvider } from "app/relay/RelayProvider"
import { ProvideScreenDimensions } from "shared/hooks"
import { GlobalStore, GlobalStoreProvider } from "./store/GlobalStore"
import { SuspenseWrapper } from "./wrappers"

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalStoreProvider>
      <ThemeProvider>
        <SuspenseWrapper>
          <RelayProvider>
            <SafeAreaProvider>
              <ProvideScreenDimensions>
                {/*  */}
                {children}
                {/*  */}
              </ProvideScreenDimensions>
            </SafeAreaProvider>
          </RelayProvider>
        </SuspenseWrapper>
      </ThemeProvider>
    </GlobalStoreProvider>
  )
}

// Theme with dark mode support
const ThemeProvider: React.FC = ({ children }) => {
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      GlobalStore.actions.devicePrefs.setSystemColorScheme(colorScheme ?? "light")
    })
    return () => subscription.remove()
  }, [])

  const isDarkMode = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme) === "dark"
  const theme = isDarkMode ? "v5dark" : "v5"

  return (
    <Theme theme={theme}>
      {children}
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
    </Theme>
  )
}
