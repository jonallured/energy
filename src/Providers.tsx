import { Theme } from "@artsy/palette-mobile"
import { ToastProvider } from "components/Toast/ToastContext"
import { useEffect } from "react"
import { Appearance, StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { RelayProvider } from "system/relay/RelayProvider"
import { GlobalStoreProvider, GlobalStore } from "system/store/GlobalStore"
import { GlobalRetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"
import { SuspenseWrapper } from "system/wrappers/SuspenseWrapper"
import { ProvideScreenDimensions } from "utils/hooks/useScreenDimensions"

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
                  <ToastProvider>{children}</ToastProvider>
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

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "black" : "white"}
      />
    </Theme>
  )
}
