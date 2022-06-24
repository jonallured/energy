import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { CreateAlbum } from "app/screens/HomeTabs/Albums/CreateAlbum"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { AlbumArtworks } from "app/screens/HomeTabs/Albums/AlbumArtworks"

export type HomeTabsScreens = {
  HomeTabs: { tabName: string } | undefined
  ArtistTabs: { slug: string }
  CreateAlbum: undefined
  Artwork: { slug: string }
  AlbumArtworks: { albumId: string }
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
      <HomeTabsStackNavigator.Screen name="AlbumArtworks" component={AlbumArtworks} />
      <HomeTabsStackNavigator.Screen name="ShowTabs" component={ShowTabs} />
    </HomeTabsStackNavigator.Navigator>
  </NavigationContainer>
)
