import { HomeTabs } from "Screens/HomeTabs/HomeTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { ArtistTabs } from "Screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { CreateAlbum } from "Screens/HomeTabs/Albums/CreateAlbum"
import { Artwork } from "Screens/_shared/Artwork/Artwork"
import { ShowTabs } from "Screens/HomeTabs/Shows/ShowTabs/ShowTabs"

export type HomeTabsScreens = {
  HomeTabs: undefined
  ArtistTabs: { slug: string }
  CreateAlbum: undefined
  Artwork: { slug: string }
  ShowTabs: { slug: string }
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
      <HomeTabsStackNavigator.Screen name="ShowTabs" component={ShowTabs} />
    </HomeTabsStackNavigator.Navigator>
  </NavigationContainer>
)
