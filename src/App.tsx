import { Theme } from "palette"
import { Tabs } from "react-native-collapsible-tab-view"
import React, { ReactNode } from "react"
import { LogBox, Text, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { NavigationContainer } from "@react-navigation/native"
import { defaultEnvironment } from "@relay/defaultEnvironent"
import { MainNavigationStack } from "@routes/MainNavigationStack"
import { HomeTabs } from "@Scenes/HomeTabs"
import ScrollableTabBarExample from "@Scenes/HomeTabs-1"
import { ShowsScreen } from "@Scenes/Shows/Shows"
import { ArtistScreen } from "@Scenes/Artist/Artist"
import { AlbumsScreen } from "@Scenes/Albums/Albums"
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
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: "orange" }}>
      <Tabs.Container>
        <Tabs.Tab name="Show">
          <ShowsScreen />
        </Tabs.Tab>
        <Tabs.Tab name="Ablum">
          <AlbumsScreen />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  )

  return (
    <AppProviders>
      <HomeTabs />
      {/* <ScrollableTabBarExample /> */}
    </AppProviders>
  )
}
