import { Theme } from "palette"
import React, { ReactNode } from "react"
import { LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { NavigationContainer } from "@react-navigation/native"
import { defaultEnvironment } from "@relay/defaultEnvironent"
import { MainNavigationStack } from "@routes/MainNavigationStack"
import { HomeTabs } from "@Scenes/HomeTabs"
import ScrollableTabBarExample from "@Scenes/HomeTabs-1"
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
      <HomeTabs />
      {/* <ScrollableTabBarExample /> */}
    </AppProviders>
  )
}
