import { Theme } from "@artsy/palette-mobile"
import JotaiNexus from "jotai-nexus"
import { useEffect } from "react"
import { Appearance, StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { RelayProvider } from "app/system/relay/RelayProvider"
import { GlobalStoreProvider, GlobalStore } from "app/system/store/GlobalStore"
import { ErrorBoundary } from "app/system/wrappers/ErrorBoundary"
import { SuspenseWrapper } from "app/system/wrappers/SuspenseWrapper"
import { ProvideScreenDimensions } from "app/utils/hooks/useScreenDimensions"

interface ProviderProps {
  relayEnvironment?: RelayModernEnvironment
}

export const Providers: React.FC<ProviderProps> = ({ children, relayEnvironment }) => {
  return (
    <ErrorBoundary>
      <GlobalStoreProvider>
        <ThemeProvider>
          <SuspenseWrapper>
            <RelayProvider relayEnvironment={relayEnvironment}>
              <SafeAreaProvider>
                <ProvideScreenDimensions>
                  {/*  */}
                  {children}
                  <JotaiNexus />
                  {/*  */}
                </ProvideScreenDimensions>
              </SafeAreaProvider>
            </RelayProvider>
          </SuspenseWrapper>
        </ThemeProvider>
      </GlobalStoreProvider>
    </ErrorBoundary>
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
