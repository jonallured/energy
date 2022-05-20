import { HomeTabs } from "Screens/HomeTabs/HomeTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { ArtistTabs } from "Screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import React from "react"
import { NavigationContainer } from "@react-navigation/native"

export type HomeTabsScreens = {
  HomeTabs: undefined
  ArtistTabs: { artistName: string }
  // Add Shows and Albums
}

export const HomeTabsStackNavigator = createStackNavigator<HomeTabsScreens>()

export const HomeTabsNavigationStack = () => (
  <NavigationContainer>
    <HomeTabsStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
      }}
    >
      <HomeTabsStackNavigator.Screen name="HomeTabs" component={HomeTabs} />
      <HomeTabsStackNavigator.Screen name="ArtistTabs" component={ArtistTabs} />
      {/* Add Shows and Albums Screen */}
    </HomeTabsStackNavigator.Navigator>
  </NavigationContainer>
)
