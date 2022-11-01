import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useStoreRehydrated } from "easy-peasy"
import { useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import { LoginScreen } from "app/screens/Auth/Login"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { FolioDesignLanguage } from "app/screens/Dev/FolioDesignLanguage"
import { InsteadOfStorybook } from "app/screens/Dev/InsteadOfStorybook"
import { StorybookScreenAnimatedTitleHeader } from "app/screens/Dev/StorybookScreenAnimatedTitleHeader"
import { StorybookScreenAnimatedTitleHeaderTabs } from "app/screens/Dev/StorybookScreenAnimatedTitleHeaderTabs"
import { StorybookScreenBottomView } from "app/screens/Dev/StorybookScreenBottomView"
import { StorybookScreenFullWidthItem } from "app/screens/Dev/StorybookScreenFullWidthItem"
import { StorybookScreenHeader } from "app/screens/Dev/StorybookScreenHeader"
import { StorybookScreenHeaderElements } from "app/screens/Dev/StorybookScreenHeaderElements"
import { StorybookScreenRawHeader } from "app/screens/Dev/StorybookScreenRawHeader"
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
import { AddItemsToAlbum } from "app/sharedUI/screens/AddItemsToAlbum"
import { Artwork } from "app/sharedUI/screens/Artwork/Artwork"
import { ArtworkWebView, useWebViewCookies } from "app/sharedUI/screens/Artwork/ArtworkWebView"
import { GlobalStore } from "app/store/GlobalStore"

export type PreAuthScreens = {
  Login: undefined
}

export type RegularScreens = {
  SelectPartner: undefined
  HomeTabs: { tabName: string } | undefined
  Settings: undefined
  EmailScreen: undefined
  OneArtwork: undefined
  MultipleArtworksBySameArtist: undefined
  MultipleArtworksAndArtists: undefined
  DarkModeSettings: undefined
  EditPresentationMode: undefined
  ArtistTabs: { slug: string; name?: string }
  AlbumTabs: { albumId: string }
  InstallImage: { url: string }
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  Search: undefined
  AlbumArtworks: { albumId: string }
  ShowTabs: { slug: string }
  AddItemsToAlbum: {
    slug: string
    areMultipleArtworks?: boolean
    name?: string
    contextArtworkSlugs?: string[]
    closeBottomSheetModal?: () => void
  }
  ArtworkWebView: { uri: string }
  CreateOrEditAlbum: {
    mode: "create" | "edit"
    albumId?: string
    artworkFromArtistTab?: string
    name?: string
    slug?: string
    contextArtworkSlugs?: string[]
    closeBottomSheetModal?: () => void
  }
  CreateOrEditAlbumChooseArtist: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtworks: { mode: "create" | "edit"; slug: string; albumId?: string }
}

export type StorybookScreens = {
  InsteadOfStorybook: undefined
  FolioDesignLanguage: undefined
  StorybookScreenAnimatedTitleHeader: undefined
  StorybookScreenAnimatedTitleHeaderTabs: undefined
  StorybookScreenHeader: undefined
  StorybookScreenHeaderElements: undefined
  StorybookScreenBottomView: undefined
  StorybookScreenFullWidthItem: undefined
  StorybookScreenRawHeader: undefined
}

export type NavigationScreens = PreAuthScreens & RegularScreens & StorybookScreens

const { Navigator, Screen } = createStackNavigator<NavigationScreens>()

export const Main = () => {
  const isRehydrated = useStoreRehydrated()
  const isLoggedIn = GlobalStore.useAppState((store) => store.auth.userAccessToken) !== null
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")

  useEffect(() => {
    if (isRehydrated) SplashScreen.hide()
  }, [isRehydrated])

  useWebViewCookies()

  if (!isRehydrated) return null

  return (
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
            <Screen name="HomeTabs" component={HomeTabs} />
            <Screen name="Settings" component={Settings} />
            <Screen name="EmailScreen" component={EmailScreen} />
            <Screen name="OneArtwork" component={OneArtwork} />
            <Screen name="MultipleArtworksBySameArtist" component={MultipleArtworksBySameArtist} />
            <Screen name="MultipleArtworksAndArtists" component={MultipleArtworksAndArtists} />
            <Screen name="DarkModeSettings" component={DarkModeSettings} />
            <Screen name="EditPresentationMode" component={EditPresentationMode} />
            <Screen name="Artwork" component={Artwork} />
            <Screen name="Search" component={Search} />
            <Screen name="ShowTabs" component={ShowTabs} />
            <Screen name="ArtistTabs" component={ArtistTabs} />
            <Screen name="AlbumTabs" component={AlbumTabs} />
            <Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
            <Screen
              name="CreateOrEditAlbumChooseArtist"
              component={CreateOrEditAlbumChooseArtist}
            />
            <Screen
              name="CreateOrEditAlbumChooseArtworks"
              component={CreateOrEditAlbumChooseArtworks}
            />
            <Screen name="ArtworkWebView" component={ArtworkWebView} />
            <Screen name="AddItemsToAlbum" component={AddItemsToAlbum} />

            {/* storybook screens */}
            <Screen name="InsteadOfStorybook" component={InsteadOfStorybook} />
            <Screen name="FolioDesignLanguage" component={FolioDesignLanguage} />
            <Screen
              name="StorybookScreenAnimatedTitleHeader"
              component={StorybookScreenAnimatedTitleHeader}
            />
            <Screen
              name="StorybookScreenAnimatedTitleHeaderTabs"
              component={StorybookScreenAnimatedTitleHeaderTabs}
            />
            <Screen name="StorybookScreenHeader" component={StorybookScreenHeader} />
            <Screen
              name="StorybookScreenHeaderElements"
              component={StorybookScreenHeaderElements}
            />
            <Screen name="StorybookScreenBottomView" component={StorybookScreenBottomView} />
            <Screen name="StorybookScreenFullWidthItem" component={StorybookScreenFullWidthItem} />
            <Screen name="StorybookScreenRawHeader" component={StorybookScreenRawHeader} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  )
}
