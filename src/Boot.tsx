import { ScreenDimensionsProvider } from "@artsy/palette-mobile"
import { ToastProvider } from "components/Toast/ToastContext"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { AnalyticsProvider } from "system/providers/AnalyticsProvider"
import { FeatureFlagProvider } from "system/providers/FeatureFlagProvider"
import { ThemeProvider } from "system/providers/ThemeProvider"
import { RelayProvider } from "system/relay/RelayProvider"
import { GlobalStoreProvider } from "system/store/GlobalStore"
import { GlobalRetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"
import { SuspenseWrapper } from "system/wrappers/SuspenseWrapper"

interface ProviderProps {
  relayEnvironment?: RelayModernEnvironment
}

export const Boot: React.FC<ProviderProps> = ({
  children,
  relayEnvironment,
}) => {
  return (
    <AnalyticsProvider>
      <GlobalRetryErrorBoundary>
        <GlobalStoreProvider>
          <FeatureFlagProvider>
            <ThemeProvider>
              <SuspenseWrapper>
                <RelayProvider relayEnvironment={relayEnvironment}>
                  <SafeAreaProvider>
                    <ScreenDimensionsProvider>
                      <ToastProvider>{children}</ToastProvider>
                    </ScreenDimensionsProvider>
                  </SafeAreaProvider>
                </RelayProvider>
              </SuspenseWrapper>
            </ThemeProvider>
          </FeatureFlagProvider>
        </GlobalStoreProvider>
      </GlobalRetryErrorBoundary>
    </AnalyticsProvider>
  )
}
