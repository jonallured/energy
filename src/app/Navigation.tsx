import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AlbumsNavigation, AlbumNavigationScreens } from "app/screens/Albums/navigation"
import { ArtistNavigation, ArtistNavigationScreens } from "app/screens/Artists/navigation"
import { useWebViewCookies } from "app/screens/Artwork/ArtworkWebView"
import { ArtworkNavigation, ArtworkNavigationScreens } from "app/screens/Artwork/navigation"
import { AuthNavigationScreens, AuthNavigation } from "app/screens/Auth/navigation"
import { HomeTabs } from "app/screens/HomeTabs"
import { SearchNavigation, SearchNavigationScreens } from "app/screens/Search/navigation"
import { SettingsNavigation, SettingsNavigationScreens } from "app/screens/Settings/navigation"
import { ShowsNavigation, ShowsNavigationScreens } from "app/screens/Shows/navigation"
import { useErrorReporting } from "app/system/hooks/useErrorReporting"
import { useNetworkStatusListener } from "app/system/hooks/useNetworkStatusListener"
import { useSystemIsDoneBooting } from "app/system/hooks/useSystemIsDoneBooting"
import { GlobalStore } from "app/system/store/GlobalStore"
import { loadUrlMap } from "app/system/sync/fileCache"
import { StatusBar } from "palette/organisms/StatusBar"
import { useEffect } from "react"
import SplashScreen from "react-native-splash-screen"

export type NavigationScreens = AuthNavigationScreens &
  AlbumNavigationScreens &
  ArtworkNavigationScreens &
  ArtistNavigationScreens &
  SettingsNavigationScreens &
  SearchNavigationScreens &
  ShowsNavigationScreens &
  Screens

type Screens = {
  HomeTabs: { tabName: string } | undefined
}

export const StackNav = createStackNavigator<NavigationScreens>()

export const Main = () => {
  const isDoneBooting = useSystemIsDoneBooting()
  const isLoggedIn = GlobalStore.useAppState((store) => store.auth.userAccessToken) !== null
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)
  const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")

  useErrorReporting()
  useNetworkStatusListener()
  useWebViewCookies()

  useEffect(() => {
    const workAfterRehydrate = async () => {
      await loadUrlMap()
      SplashScreen.hide()
    }

    if (isDoneBooting) {
      workAfterRehydrate()
    }
  }, [isDoneBooting])

  if (!isDoneBooting) {
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
              {SearchNavigation()}
              {SettingsNavigation()}
              {ShowsNavigation()}
            </>
          )}
        </StackNav.Navigator>
      </NavigationContainer>

      <StatusBar backgroundColor="transparent" />
    </>
  )
}
