import { ReactNode } from "react"
import { LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { defaultEnvironment } from "./relay/environment/defaultEnvironent"
import { MainNavigationStack } from "./navigation/MainNavigationStack"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { SuspenseWrapper } from "./wrappers"
import { Theme } from "palette"
import { ProvideScreenDimensions } from "shared/hooks"

LogBox.ignoreLogs(["Expected style "])

const AppProviders = ({ children }: { children: ReactNode }) => (
  <GlobalStoreProvider>
    <Theme>
      <RelayEnvironmentProvider environment={defaultEnvironment}>
        <SuspenseWrapper>
          <SafeAreaProvider>
            <ProvideScreenDimensions>{children}</ProvideScreenDimensions>
          </SafeAreaProvider>
        </SuspenseWrapper>
      </RelayEnvironmentProvider>
    </Theme>
  </GlobalStoreProvider>
)

export const App = () => {
  return (
    <AppProviders>
      <MainNavigationStack />
    </AppProviders>
  )
}
