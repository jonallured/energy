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
import { ErrorBoundaryWrapper } from "app/wrappers/ErrorBoundayWrapper"

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
    artworkIdToAdd?: string
    closeBottomSheetModal?: () => void
  }
  ArtworkWebView: { uri: string }
  CreateOrEditAlbum: {
    mode: "create" | "edit"
    albumId?: string
    artworkIdToAdd?: string
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
            <Screen name="Login" children={() => ErrorBoundaryWrapper(LoginScreen)} />
          </>
        ) : selectedPartner === null ? (
          <>
            <Screen
              name="SelectPartner"
              children={() => ErrorBoundaryWrapper(SelectPartnerScreen)}
            />
          </>
        ) : (
          // logged in and partner selected
          <>
            <Screen name="HomeTabs" children={() => ErrorBoundaryWrapper(HomeTabs)} />
            <Screen name="Settings" children={() => ErrorBoundaryWrapper(Settings)} />
            <Screen name="EmailScreen" children={() => ErrorBoundaryWrapper(EmailScreen)} />
            <Screen name="OneArtwork" children={() => ErrorBoundaryWrapper(OneArtwork)} />
            <Screen
              name="MultipleArtworksBySameArtist"
              children={() => ErrorBoundaryWrapper(MultipleArtworksBySameArtist)}
            />
            <Screen
              name="MultipleArtworksAndArtists"
              children={() => ErrorBoundaryWrapper(MultipleArtworksAndArtists)}
            />
            <Screen
              name="DarkModeSettings"
              children={() => ErrorBoundaryWrapper(DarkModeSettings)}
            />
            <Screen
              name="EditPresentationMode"
              children={() => ErrorBoundaryWrapper(EditPresentationMode)}
            />
            <Screen name="Artwork" children={() => ErrorBoundaryWrapper(Artwork)} />
            <Screen name="Search" children={() => ErrorBoundaryWrapper(Search)} />
            <Screen name="ShowTabs" children={() => ErrorBoundaryWrapper(ShowTabs)} />
            <Screen name="ArtistTabs" children={() => ErrorBoundaryWrapper(ArtistTabs)} />
            <Screen name="AlbumTabs" children={() => ErrorBoundaryWrapper(AlbumTabs)} />
            <Screen
              name="CreateOrEditAlbum"
              children={() => ErrorBoundaryWrapper(CreateOrEditAlbum)}
            />
            <Screen
              name="CreateOrEditAlbumChooseArtist"
              children={() => ErrorBoundaryWrapper(CreateOrEditAlbumChooseArtist)}
            />
            <Screen
              name="CreateOrEditAlbumChooseArtworks"
              children={() => ErrorBoundaryWrapper(CreateOrEditAlbumChooseArtworks)}
            />
            <Screen name="ArtworkWebView" children={() => ErrorBoundaryWrapper(ArtworkWebView)} />
            <Screen name="AddItemsToAlbum" children={() => ErrorBoundaryWrapper(AddItemsToAlbum)} />

            {/* storybook screens */}
            <Screen
              name="InsteadOfStorybook"
              children={() => ErrorBoundaryWrapper(InsteadOfStorybook)}
            />
            <Screen
              name="FolioDesignLanguage"
              children={() => ErrorBoundaryWrapper(FolioDesignLanguage)}
            />
            <Screen
              name="StorybookScreenAnimatedTitleHeader"
              children={() => ErrorBoundaryWrapper(StorybookScreenAnimatedTitleHeader)}
            />
            <Screen
              name="StorybookScreenAnimatedTitleHeaderTabs"
              children={() => ErrorBoundaryWrapper(StorybookScreenAnimatedTitleHeaderTabs)}
            />
            <Screen
              name="StorybookScreenHeader"
              children={() => ErrorBoundaryWrapper(StorybookScreenHeader)}
            />
            <Screen
              name="StorybookScreenHeaderElements"
              children={() => ErrorBoundaryWrapper(StorybookScreenHeaderElements)}
            />
            <Screen
              name="StorybookScreenBottomView"
              children={() => ErrorBoundaryWrapper(StorybookScreenBottomView)}
            />
            <Screen
              name="StorybookScreenFullWidthItem"
              children={() => ErrorBoundaryWrapper(StorybookScreenFullWidthItem)}
            />
            <Screen
              name="StorybookScreenRawHeader"
              children={() => ErrorBoundaryWrapper(StorybookScreenRawHeader)}
            />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  )
}
