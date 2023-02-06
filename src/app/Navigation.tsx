import { useColor } from "@artsy/palette-mobile"
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useEffect } from "react"
import { TouchableOpacity } from "react-native"
import SplashScreen from "react-native-splash-screen"
import { AlbumsNavigation, AlbumNavigationScreens } from "app/screens/Albums/navigation"
import { ArtistNavigation, ArtistNavigationScreens } from "app/screens/Artists/navigation"
import { useWebViewCookies } from "app/screens/Artwork/ArtworkWebView"
import { ArtworkNavigation, ArtworkNavigationScreens } from "app/screens/Artwork/navigation"
import { AuthNavigationScreens, AuthNavigation } from "app/screens/Auth/navigation"
import { DevNavigation, DevNavigationScreens } from "app/screens/Dev/navigation"
import { HomeTabs } from "app/screens/HomeTabs"
import { SearchNavigation, SearchNavigationScreens } from "app/screens/Search/navigation"
import { SettingsNavigation, SettingsNavigationScreens } from "app/screens/Settings/navigation"
import { ShowsNavigation, ShowsNavigationScreens } from "app/screens/Shows/navigation"
import { useErrorReporting } from "app/system/hooks/useErrorReporting"
import { useNetworkStatusListener } from "app/system/hooks/useNetworkStatusListener"
import { useSystemIsDoneBooting } from "app/system/hooks/useSystemIsDoneBooting"
import { GlobalStore } from "app/system/store/GlobalStore"
import { loadUrlMap } from "app/system/sync/fileCache"
import { useIsOnline } from "app/utils/hooks/useIsOnline"
import { StatusBar } from "palette/organisms/StatusBar"

export type NavigationScreens = AuthNavigationScreens &
  AlbumNavigationScreens &
  ArtworkNavigationScreens &
  ArtistNavigationScreens &
  SettingsNavigationScreens &
  SearchNavigationScreens &
  ShowsNavigationScreens &
  DevNavigationScreens &
  Screens

type Screens = {
  HomeTabs: { tabName: string } | undefined
}

export const StackNav = createStackNavigator<NavigationScreens>()

export const Main = () => {
  const isDoneBooting = useSystemIsDoneBooting()
  const isOnline = useIsOnline()
  const isLoggedIn = GlobalStore.useAppState((store) => store.auth.userAccessToken) !== null
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)
  const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")
  const showDevMenuButton = GlobalStore.useAppState((state) => state.devicePrefs.showDevMenuButton)

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

          {DevNavigation()}
        </StackNav.Navigator>

        {showDevMenuButton && <DevMenuButton />}
      </NavigationContainer>

      <StatusBar backgroundColor={isOnline ? "transparent" : "pink"} />
    </>
  )
}

const DevMenuButton = () => {
  const { navigate } = useNavigation<NavigationProp<NavigationScreens>>()
  const color = useColor()
  return (
    <TouchableOpacity
      onPress={() => navigate("DevMenu")}
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        height: 40,
        width: 40,
        backgroundColor: color("devpurple"),
        borderRadius: 25,
      }}
    />
  )
}
