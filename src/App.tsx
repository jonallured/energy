import { Theme } from "palette"
import React, { ReactNode } from "react"
import { LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { defaultEnvironment } from "relay/environment/defaultEnvironent"
import { MainNavigationStack } from "routes/MainNavigationStack"
LogBox.ignoreLogs(["Expected style "])

const AppProviders = ({ children }: { children: ReactNode }) => (
  <GlobalStoreProvider>
    <Theme>
      <RelayEnvironmentProvider environment={defaultEnvironment}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
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
