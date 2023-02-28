import { Theme } from "@artsy/palette-mobile"
import { RelayProvider } from "app/system/relay/RelayProvider"
import { GlobalStoreProvider, GlobalStore } from "app/system/store/GlobalStore"
import { GlobalRetryErrorBoundary } from "app/system/wrappers/RetryErrorBoundary"
import { SuspenseWrapper } from "app/system/wrappers/SuspenseWrapper"
import { ProvideScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import JotaiNexus from "jotai-nexus"
import { useEffect } from "react"
import { Appearance, StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

interface ProviderProps {
  relayEnvironment?: RelayModernEnvironment
}

export const Providers: React.FC<ProviderProps> = ({ children, relayEnvironment }) => {
  return (
    <GlobalRetryErrorBoundary>
      <GlobalStoreProvider>
        <ThemeProvider>
          <SuspenseWrapper>
            <RelayProvider relayEnvironment={relayEnvironment}>
              <SafeAreaProvider>
                <ProvideScreenDimensions>
                  {children}
                  <JotaiNexus />
                </ProvideScreenDimensions>
              </SafeAreaProvider>
            </RelayProvider>
          </SuspenseWrapper>
        </ThemeProvider>
      </GlobalStoreProvider>
    </GlobalRetryErrorBoundary>
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
  const theme = isDarkMode ? "v3dark" : "v3light"

  return (
    <Theme theme={theme}>
      {children}

      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
    </Theme>
  )
}
