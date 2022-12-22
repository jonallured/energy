import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useStoreRehydrated } from "easy-peasy"
import { useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import { AddItemsToAlbum } from "app/components/AddItemsToAlbum"
import { Artwork } from "app/screens/Artwork/Artwork"
import { useWebViewCookies, ArtworkWebView } from "app/screens/Artwork/ArtworkWebView"
import { LoginScreen } from "app/screens/Auth/Login"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { StorybookNavigation } from "app/screens/Dev/StorybookNavigation"
import { AlbumTabs } from "app/screens/HomeTabs/Albums/AlbumTabs/AlbumTabs"
import { CreateOrEditAlbum } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/HomeTabs/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { EmailScreen } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/EmailScreen"
import { MultipleArtworksAndArtists } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/MultipleArtworksBySameArtist"
import { OneArtwork } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/EmailScreen/OneArtwork"
import { ArtistTabs } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { HomeTabs } from "app/screens/HomeTabs/HomeTabs"
import { Search } from "app/screens/HomeTabs/Search/Search"
import { DarkModeSettings } from "app/screens/HomeTabs/Settings/DarkModeSettings"
import { EditPresentationMode } from "app/screens/HomeTabs/Settings/EditPresentationMode"
import { Settings } from "app/screens/HomeTabs/Settings/Settings"
import { ShowTabs } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { useNetworkStatusListener } from "app/system/hooks/useNetworkStatusListener"
import { GlobalStore } from "app/system/store/GlobalStore"
import { loadUrlMap } from "app/system/sync/fileCache"
import { StatusBar } from "palette/organisms/StatusBar"

export type AuthScreens = {
  Login: undefined
}

export type Screens = {
  AddItemsToAlbum: {
    artworkIdToAdd?: string
    closeBottomSheetModal?: () => void
  }
  AlbumArtworks: { albumId: string }
  AlbumTabs: { albumId: string }
  ArtistTabs: { slug: string; name: string }
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  ArtworkWebView: { uri: string }
  CreateOrEditAlbum: {
    mode: "create" | "edit"
    albumId?: string
    artworkIdToAdd?: string
    closeBottomSheetModal?: () => void
  }
  CreateOrEditAlbumChooseArtist: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtworks: { mode: "create" | "edit"; slug: string; albumId?: string }
  DarkModeSettings: undefined
  EditPresentationMode: undefined
  EmailScreen: undefined
  HomeTabs: { tabName: string } | undefined
  InstallImage: { url: string }
  MultipleArtworksAndArtists: undefined
  MultipleArtworksBySameArtist: undefined
  OneArtwork: undefined
  Search: undefined
  SelectPartner: undefined
  Settings: undefined
  ShowTabs: { slug: string }
}

export type NavigationScreens = AuthScreens & Screens

const { Navigator, Screen } = createStackNavigator<NavigationScreens>()

export const Main = () => {
  const isRehydrated = useStoreRehydrated()
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)
  const isLoggedIn = GlobalStore.useAppState((store) => store.auth.userAccessToken) !== null
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")

  // Check the network status and toggle the offline mode if needed
  useNetworkStatusListener()

  useEffect(() => {
    const workAfterRehydrate = async () => {
      await loadUrlMap()
      SplashScreen.hide()
    }

    if (isRehydrated) {
      workAfterRehydrate()
    }
  }, [isRehydrated])

  useWebViewCookies()

  if (!isRehydrated) return null

  return (
    <>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeTabs">
          {!isLoggedIn ? (
            <>
              <Screen name="Login" component={LoginScreen} />
            </>
          ) : selectedPartner === null ? (
            <>
              <Screen name="SelectPartner" component={SelectPartnerScreen} />
            </>
          ) : (
            // logged in and partner selected
            <>
              <Screen name="AddItemsToAlbum" component={AddItemsToAlbum} />
              <Screen name="ArtworkWebView" component={ArtworkWebView} />
              <Screen name="AlbumTabs" component={AlbumTabs} />
              <Screen name="ArtistTabs" component={ArtistTabs} />
              <Screen name="Artwork" component={Artwork} />
              <Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
              <Screen
                name="CreateOrEditAlbumChooseArtist"
                component={CreateOrEditAlbumChooseArtist}
              />
              <Screen
                name="CreateOrEditAlbumChooseArtworks"
                component={CreateOrEditAlbumChooseArtworks}
              />
              <Screen name="DarkModeSettings" component={DarkModeSettings} />
              <Screen name="EditPresentationMode" component={EditPresentationMode} />
              <Screen name="EmailScreen" component={EmailScreen} />
              <Screen name="HomeTabs" component={HomeTabs} />
              <Screen name="MultipleArtworksAndArtists" component={MultipleArtworksAndArtists} />
              <Screen
                name="MultipleArtworksBySameArtist"
                component={MultipleArtworksBySameArtist}
              />
              <Screen name="OneArtwork" component={OneArtwork} />
              <Screen name="Search" component={Search} />
              <Screen name="Settings" component={Settings} />
              <Screen name="ShowTabs" component={ShowTabs} />

              {/* Dev */}
              {StorybookNavigation()}
            </>
          )}
        </Navigator>
      </NavigationContainer>

      <StatusBar backgroundColor={isOnline ? "transparent" : "pink"} />
    </>
  )
}
