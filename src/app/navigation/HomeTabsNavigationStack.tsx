import { AddArtworkToAlbum } from "app/sharedUI/screens/Artwork/AddArtworkToAlbum"
import { AlbumArtworks } from "app/screens/HomeTabs/Albums/AlbumArtworks"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"
import { ArtworkWebView } from "app/sharedUI/screens/Artwork/ArtworkWebView"
import { CreateOrEditAlbum } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { DarkModeSettings } from "app/screens/HomeTabs/Settings/DarkModeSettings"
import { GlobalStore } from "app/store/GlobalStore"
import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { InstallImage } from "app/sharedUI/screens/InstallImage/InstallImage"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { Settings } from "app/screens/HomeTabs/Settings/Settings"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { createStackNavigator } from "@react-navigation/stack"
import { useColor } from "palette"
import { EditPresentationMode } from "app/screens/HomeTabs/Settings/EditPresentationMode"
import { FolioDesignLanguage } from "app/screens/Dev/FolioDesignLanguage"
import { InsteadOfStorybook } from "app/screens/Dev/InsteadOfStorybook"

export type HomeTabsScreens = {
  HomeTabs: { tabName: string } | undefined
  Settings: undefined
  DarkModeSettings: undefined
  FolioDesignLanguage: undefined
  EditPresentationMode: undefined
  ArtistTabs: { slug: string }
  InstallImage: { url: string }
  InsteadOfStorybook: undefined
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
      >
        <Screen name="HomeTabs" component={HomeTabs} />
        <Screen name="Settings" component={Settings} />
        <Screen name="DarkModeSettings" component={DarkModeSettings} />
        <Screen name="InsteadOfStorybook" component={InsteadOfStorybook} />
        <Screen name="FolioDesignLanguage" component={FolioDesignLanguage} />
        <Screen name="ArtistTabs" component={ArtistTabs} />
        <Screen name="Artwork" component={Artwork} />
        <Screen name="InstallImage" component={InstallImage} />
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
