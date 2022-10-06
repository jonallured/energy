import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { FolioDesignLanguage } from "app/screens/Dev/FolioDesignLanguage"
import { InsteadOfStorybook } from "app/screens/Dev/InsteadOfStorybook"
import { AlbumArtworks } from "app/screens/HomeTabs/Albums/AlbumArtworks"
import { CreateOrEditAlbum } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { EmailScreen } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/EmailScreen"
import { MultipleArtworksAndArtists } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/MultipleArtworksBySameArtist"
import { OneArtwork } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/OneArtwork"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { DarkModeSettings } from "app/screens/HomeTabs/Settings/DarkModeSettings"
import { EditPresentationMode } from "app/screens/HomeTabs/Settings/EditPresentationMode"
import { Settings } from "app/screens/HomeTabs/Settings/Settings"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { AddArtworkToAlbum } from "app/sharedUI/screens/Artwork/AddArtworkToAlbum"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"
import { ArtworkWebView } from "app/sharedUI/screens/Artwork/ArtworkWebView"
import { GlobalStore } from "app/store/GlobalStore"
import { useColor } from "palette"

export type HomeTabsScreens = {
  HomeTabs: { tabName: string } | undefined
  Settings: undefined
  EmailScreen: undefined
  OneArtwork: undefined
  MultipleArtworksBySameArtist: undefined
  MultipleArtworksAndArtists: undefined
  DarkModeSettings: undefined
  FolioDesignLanguage: undefined
  EditPresentationMode: undefined
  ArtistTabs: { slug: string; name: string }
  InstallImage: { url: string }
  InsteadOfStorybook: undefined
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  AlbumArtworks: { albumId: string }
  ShowTabs: { slug: string }
  AddArtworkToAlbum: { slug: string; contextArtworkSlugs?: string[] }
  ArtworkWebView: { uri: string }
  CreateOrEditAlbum: {
    mode: "create" | "edit"
    albumId?: string
    artworkFromArtistTab?: string
    slug?: string
    contextArtworkSlugs?: string[]
  }
  CreateOrEditAlbumChooseArtist: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtworks: { mode: "create" | "edit"; slug: string; albumId?: string }
}

const { Navigator, Screen } = createStackNavigator<HomeTabsScreens>()

export const HomeTabsNavigationStack = () => {
  const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")
  const color = useColor()

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: color("background") },
        }}
        initialRouteName="HomeTabs"
      >
        <Screen name="HomeTabs" component={HomeTabs} />
        <Screen name="EmailScreen" component={EmailScreen} />
        <Screen name="OneArtwork" component={OneArtwork} />
        <Screen name="MultipleArtworksBySameArtist" component={MultipleArtworksBySameArtist} />
        <Screen name="MultipleArtworksAndArtists" component={MultipleArtworksAndArtists} />
        <Screen name="Settings" component={Settings} />
        <Screen name="DarkModeSettings" component={DarkModeSettings} />
        <Screen name="InsteadOfStorybook" component={InsteadOfStorybook} />
        <Screen name="FolioDesignLanguage" component={FolioDesignLanguage} />
        <Screen name="ArtistTabs" component={ArtistTabs} />
        <Screen name="Artwork" component={Artwork} />
        <Screen name="AlbumArtworks" component={AlbumArtworks} />
        <Screen name="ShowTabs" component={ShowTabs} />
        <Screen name="AddArtworkToAlbum" component={AddArtworkToAlbum} />
        <Screen name="ArtworkWebView" component={ArtworkWebView} />
        <Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
        <Screen name="CreateOrEditAlbumChooseArtist" component={CreateOrEditAlbumChooseArtist} />
        <Screen name="EditPresentationMode" component={EditPresentationMode} />
        <Screen
          name="CreateOrEditAlbumChooseArtworks"
          component={CreateOrEditAlbumChooseArtworks}
        />
      </Navigator>
    </NavigationContainer>
  )
}
