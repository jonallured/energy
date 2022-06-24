import { Theme } from "palette"
import { ReactNode } from "react"
import { LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { MainNavigationStack } from "./routes/MainNavigationStack"
import { defaultEnvironment } from "./relay/environment/defaultEnvironent"
import { ProvideScreenDimensions } from "shared/hooks"

LogBox.ignoreLogs(["Expected style "])

const AppProviders = ({ children }: { children: ReactNode }) => (
  <GlobalStoreProvider>
    <Theme>
      <RelayEnvironmentProvider environment={defaultEnvironment}>
        <SafeAreaProvider>
          <ProvideScreenDimensions>{children}</ProvideScreenDimensions>
        </SafeAreaProvider>
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
