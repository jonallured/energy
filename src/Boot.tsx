import { ScreenDimensionsProvider } from "@artsy/palette-mobile"
import { ToastProvider } from "components/Toast/ToastContext"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { AnalyticsProvider } from "system/analytics/AnalyticsProvider"
import { RelayProvider } from "system/relay/RelayProvider"
import { GlobalStoreProvider } from "system/store/GlobalStore"
import { GlobalRetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"
import { SuspenseWrapper } from "system/wrappers/SuspenseWrapper"
import { ThemeProvider } from "system/wrappers/ThemeProvider"
import { ProvideScreenDimensions } from "utils/hooks/useScreenDimensions"

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
          <ThemeProvider>
            <SuspenseWrapper>
              <RelayProvider relayEnvironment={relayEnvironment}>
                <SafeAreaProvider>
                  <ScreenDimensionsProvider>
                    <ProvideScreenDimensions>
                      <ToastProvider>{children}</ToastProvider>
                    </ProvideScreenDimensions>
                  </ScreenDimensionsProvider>
                </SafeAreaProvider>
              </RelayProvider>
            </SuspenseWrapper>
          </ThemeProvider>
        </GlobalStoreProvider>
      </GlobalRetryErrorBoundary>
    </AnalyticsProvider>
  )
}
