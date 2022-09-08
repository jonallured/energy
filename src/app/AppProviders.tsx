import { cloneDeep } from "lodash"
import { useEffect } from "react"
import { Appearance, StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { Text, Theme, _test_THEMES } from "palette"
import { ProvideScreenDimensions } from "shared/hooks"
import { defaultEnvironment } from "./relay/environment/defaultEnvironent"
import { GlobalStore, GlobalStoreProvider } from "./store/GlobalStore"
import { SuspenseWrapper } from "./wrappers"

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <GlobalStoreProvider>
    <ThemeProvider>
      {/* @ts-expect-error */}
      <RelayEnvironmentProvider environment={defaultEnvironment}>
        <SuspenseWrapper>
          <SafeAreaProvider>
            <ProvideScreenDimensions>{children}</ProvideScreenDimensions>
          </SafeAreaProvider>
        </SuspenseWrapper>
      </RelayEnvironmentProvider>
    </ThemeProvider>
  </GlobalStoreProvider>
)

// theme with dark mode support
function ThemeProvider({ children }: { children?: React.ReactNode }) {
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