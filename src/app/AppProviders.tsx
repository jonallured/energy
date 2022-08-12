import { Text, Theme, _test_THEMES } from "palette"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GlobalStore, GlobalStoreProvider } from "./store/GlobalStore"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { defaultEnvironment } from "./relay/environment/defaultEnvironent"
import { ProvideScreenDimensions } from "shared/hooks"
import { SuspenseWrapper } from "./wrappers"
import { Appearance, StatusBar } from "react-native"
import { useEffect } from "react"
import { cloneDeep } from "lodash"

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
  const overrides = GlobalStore.useAppState((state) => state.devicePrefs.overrides)

  //   const theme = isDarkMode ? "v5dark" : "v5"
  const temp = isDarkMode ? _test_THEMES.v5dark : _test_THEMES.v5
  temp.colors = isDarkMode ? { ...temp.colors, ...overrides } : temp.colors
  const theme = cloneDeep(temp)

  return (
    <Theme theme={theme}>
      {children}
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
    </Theme>
  )
}
