import { HomeTabs } from "Screens/HomeTabs/HomeTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { ArtistTabs } from "Screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"

export type HomeTabsScreens = {
  HomeTabs: undefined
  ArtistTabs: { slug: string }
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
