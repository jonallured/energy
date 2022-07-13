import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { CreateAlbum } from "app/screens/HomeTabs/Albums/CreateAlbum/CreateAlbum"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { AlbumArtworks } from "app/screens/HomeTabs/Albums/AlbumArtworks"
import { AddArtworkToAlbum } from "app/sharedUI/screens/Artwork/AddArtworkToAlbum"
import { CreateAlbumChooseArtist } from "app/screens/HomeTabs/Albums/CreateAlbum/CreateAlbumChooseArtist"
import { CreateAlbumPickArtworksOfArtist } from "app/screens/HomeTabs/Albums/CreateAlbum/CreateAlbumPickArtworksOfArtist"

export type HomeTabsScreens = {
  HomeTabs: { tabName: string } | undefined
  ArtistTabs: { slug: string }
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  AlbumArtworks: { albumId: string }
  ShowTabs: { slug: string }
  AddArtworkToAlbum: { slug: string }

  //Create album flow screens
  CreateAlbum: undefined
  CreateAlbumChooseArtist: undefined
  CreateAlbumPickArtworksOfArtist: { slug: string }
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
      <HomeTabsStackNavigator.Screen name="Artwork" component={Artwork} />
      <HomeTabsStackNavigator.Screen name="AlbumArtworks" component={AlbumArtworks} />
      <HomeTabsStackNavigator.Screen name="ShowTabs" component={ShowTabs} />
      <HomeTabsStackNavigator.Screen name="AddArtworkToAlbum" component={AddArtworkToAlbum} />

      {/* Create album flow screens */}
      <HomeTabsStackNavigator.Screen name="CreateAlbum" component={CreateAlbum} />
      <HomeTabsStackNavigator.Screen
        name="CreateAlbumChooseArtist"
        component={CreateAlbumChooseArtist}
      />
      <HomeTabsStackNavigator.Screen
        name="CreateAlbumPickArtworksOfArtist"
        component={CreateAlbumPickArtworksOfArtist}
      />
    </HomeTabsStackNavigator.Navigator>
  </NavigationContainer>
)
