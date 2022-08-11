import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AlbumArtworks } from "app/screens/HomeTabs/Albums/AlbumArtworks"
import { CreateOrEditAlbum } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { Settings } from "app/screens/HomeTabs/Settings/Settings"
import { DarkModeSettings } from "app/screens/HomeTabs/Settings/DarkModeSettings"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { AddArtworkToAlbum } from "app/sharedUI/screens/Artwork/AddArtworkToAlbum"
import { ArtworkWebView } from "app/sharedUI/screens/Artwork/ArtworkWebView"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"
import { InstallImage } from "app/sharedUI/screens/InstallImage/InstallImage"
import { EditPresentationMode } from "app/screens/HomeTabs/Settings/EditPresentationMode"

export type HomeTabsScreens = {
  HomeTabs: { tabName: string } | undefined
  Settings: undefined
  DarkModeSettings: undefined
  EditPresentationMode: undefined
  ArtistTabs: { slug: string }
  InstallImage: { url: string }
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  AlbumArtworks: { albumId: string }
  ShowTabs: { slug: string }
  AddArtworkToAlbum: { slug: string }
  ArtworkWebView: { uri: string }
  CreateOrEditAlbum: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtist: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtworks: { mode: "create" | "edit"; slug: string; albumId?: string }
}

const { Navigator, Screen } = createStackNavigator<HomeTabsScreens>()

export const HomeTabsNavigationStack = () => (
  <NavigationContainer>
    <Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
      }}
    >
      <Screen name="HomeTabs" component={HomeTabs} />
      <Screen name="Settings" component={Settings} />
      <Screen name="DarkModeSettings" component={DarkModeSettings} />
      <Screen name="EditPresentationMode" component={EditPresentationMode} />
      <Screen name="ArtistTabs" component={ArtistTabs} />
      <Screen name="Artwork" component={Artwork} />
      <Screen name="InstallImage" component={InstallImage} />
      <Screen name="AlbumArtworks" component={AlbumArtworks} />
      <Screen name="ShowTabs" component={ShowTabs} />
      <Screen name="AddArtworkToAlbum" component={AddArtworkToAlbum} />
      <Screen name="ArtworkWebView" component={ArtworkWebView} />
      <Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
      <Screen name="CreateOrEditAlbumChooseArtist" component={CreateOrEditAlbumChooseArtist} />
      <Screen name="CreateOrEditAlbumChooseArtworks" component={CreateOrEditAlbumChooseArtworks} />
    </Navigator>
  </NavigationContainer>
)
