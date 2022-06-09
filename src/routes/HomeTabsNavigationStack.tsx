import { HomeTabs } from "Screens/HomeTabs/HomeTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { ArtistTabs } from "Screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { CreateAlbum } from "Screens/HomeTabs/Albums/CreateAlbum"
import { Artwork } from "Screens/_shared/Artwork/Artwork"

export type HomeTabsScreens = {
  HomeTabs: undefined
  ArtistTabs: { slug: string }
  CreateAlbum: undefined
  Artwork: { slug: string }
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
      <HomeTabsStackNavigator.Screen name="CreateAlbum" component={CreateAlbum} />
      <HomeTabsStackNavigator.Screen name="Artwork" component={Artwork} />
      {/* Add Shows */}
    </HomeTabsStackNavigator.Navigator>
  </NavigationContainer>
)
