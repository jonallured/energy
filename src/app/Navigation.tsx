import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useStoreRehydrated } from "easy-peasy"
import { useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import { AlbumsNavigation, AlbumNavigationScreens } from "app/screens/Albums/navigation"
import {
  EmailNavigation,
  EmailNavigationScreens,
} from "app/screens/Artists/ArtistTabs/ArtistArtworks/EmailScreen/navigation"
import { ArtistNavigation, ArtistNavigationScreens } from "app/screens/Artists/navigation"
import { useWebViewCookies } from "app/screens/Artwork/ArtworkWebView"
import { ArtworkNavigation, ArtworkNavigationScreens } from "app/screens/Artwork/navigation"
import { AuthNavigationScreens, AuthNavigation } from "app/screens/Auth/navigation"
import { DevNavigation, DevNavigationScreens } from "app/screens/Dev/navigation"
import { HomeTabs } from "app/screens/HomeTabs"
import { SearchNavigation, SearchNavigationScreens } from "app/screens/Search/navigation"
import { SettingsNavigation, SettingsNavigationScreens } from "app/screens/Settings/navigation"
import { ShowsNavigation, ShowsNavigationScreens } from "app/screens/Shows/navigation"
import { useNetworkStatusListener } from "app/system/hooks/useNetworkStatusListener"
import { GlobalStore } from "app/system/store/GlobalStore"
import { loadUrlMap } from "app/system/sync/fileCache"
import { StatusBar } from "palette/organisms/StatusBar"

export type NavigationScreens = AuthNavigationScreens &
  AlbumNavigationScreens &
  ArtworkNavigationScreens &
  ArtistNavigationScreens &
  SettingsNavigationScreens &
  EmailNavigationScreens &
  SearchNavigationScreens &
  ShowsNavigationScreens &
  DevNavigationScreens &
  Screens

type Screens = {
  HomeTabs: { tabName: string } | undefined
}

export const StackNav = createStackNavigator<NavigationScreens>()

export const Main = () => {
  const isRehydrated = useStoreRehydrated()
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)
  const isLoggedIn = GlobalStore.useAppState((store) => store.auth.userAccessToken) !== null
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")

  // Check the network status and toggle the offline mode if needed
  useNetworkStatusListener()
  useWebViewCookies()

  useEffect(() => {
    const workAfterRehydrate = async () => {
      await loadUrlMap()
      SplashScreen.hide()
    }

    if (isRehydrated) {
      workAfterRehydrate()
    }
  }, [isRehydrated])

  if (!isRehydrated) {
    return null
  }

  return (
    <>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <StackNav.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeTabs">
          {AuthNavigation({ isLoggedIn, selectedPartner })}

          {isLoggedIn && selectedPartner && (
            <>
              <StackNav.Screen name="HomeTabs" component={HomeTabs} />

              {AlbumsNavigation()}
              {ArtistNavigation()}
              {ArtworkNavigation()}
              {EmailNavigation()}
              {SearchNavigation()}
              {SettingsNavigation()}
              {ShowsNavigation()}
            </>
          )}

          {DevNavigation()}
        </StackNav.Navigator>
      </NavigationContainer>

      <StatusBar backgroundColor={isOnline ? "transparent" : "pink"} />
    </>
  )
}
