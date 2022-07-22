import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AlbumArtworks } from "app/screens/HomeTabs/Albums/AlbumArtworks"
import { CreateOrEditAlbum } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { AddArtworkToAlbum } from "app/sharedUI/screens/Artwork/AddArtworkToAlbum"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"

export type HomeTabsScreens = {
  HomeTabs: { tabName: string } | undefined
  ArtistTabs: { slug: string }
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  AlbumArtworks: { albumId: string }
  ShowTabs: { slug: string }
  AddArtworkToAlbum: { slug: string }
  CreateOrEditAlbum: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtist: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtworks: { mode: "create" | "edit"; slug: string; albumId?: string }
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
      <HomeTabsStackNavigator.Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
      <HomeTabsStackNavigator.Screen
        name="CreateOrEditAlbumChooseArtist"
        component={CreateOrEditAlbumChooseArtist}
      />
      <HomeTabsStackNavigator.Screen
        name="CreateOrEditAlbumChooseArtworks"
        component={CreateOrEditAlbumChooseArtworks}
      />
    </HomeTabsStackNavigator.Navigator>
  </NavigationContainer>
)
