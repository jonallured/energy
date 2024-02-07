import { Flex } from "@artsy/palette-mobile"
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useUnleashClient } from "@unleash/proxy-client-react"
import { StatusBar } from "components/StatusBar"
import { useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import {
  AlbumsNavigation,
  AlbumNavigationScreens,
} from "screens/Albums/navigation"
import {
  ArtistNavigation,
  ArtistNavigationScreens,
} from "screens/Artists/navigation"
import {
  ArtworkNavigation,
  ArtworkNavigationScreens,
} from "screens/Artwork/navigation"
import { AuthNavigationScreens, AuthNavigation } from "screens/Auth/navigation"
import { HomeTabs } from "screens/HomeTabs"
import {
  SearchNavigation,
  SearchNavigationScreens,
} from "screens/Search/navigation"
import {
  SettingsNavigation,
  SettingsNavigationScreens,
} from "screens/Settings/navigation"
import {
  ShowsNavigation,
  ShowsNavigationScreens,
} from "screens/Shows/navigation"
import { useAppStatus } from "system/hooks/useAppStatus"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useErrorReporting } from "system/hooks/useErrorReporting"
import { useNetworkStatusListener } from "system/hooks/useNetworkStatusListener"
import { useSystemIsDoneBooting } from "system/hooks/useSystemIsDoneBooting"
import { GlobalStore } from "system/store/GlobalStore"
import { loadUrlMap } from "system/sync/fileCache/urlMap"
import { useAndroidNavigationBarThemeListener } from "utils/hooks/useAndroidNavigationBarThemeListener"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { useWebViewCookies } from "utils/hooks/useWebViewCookies"

export type NavigationScreens = AuthNavigationScreens &
  AlbumNavigationScreens &
  ArtworkNavigationScreens &
  ArtistNavigationScreens &
  SettingsNavigationScreens &
  SearchNavigationScreens &
  ShowsNavigationScreens &
  MiscScreens

type MiscScreens = {
  Albums: {}
  AlbumArtworks: {}
  AlbumDocuments: {}
  AlbumInstalls: {}
  Artists: {}
  ArtistArtworks: {}
  ArtistDocuments: {}
  ArtistShows: {}
  EditArtworkInCms: {}
  HomeTabs:
    | {
        tabName: string
      }
    | undefined
  Shows: {}
  ShowArtworks: {}
  ShowDocuments: {}
  ShowInstalls: {}
}

export type ScreenNames = keyof NavigationScreens

export const StackNav = createNativeStackNavigator<NavigationScreens>()

export const Main: React.FC = () => {
  const isLoggedIn =
    GlobalStore.useAppState((store) => store.auth.userAccessToken) !== null

  const selectedPartner = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )

  const { maybeTrackFirstInstall } = useAppTracking()
  const isDoneBooting = useSystemIsDoneBooting()
  const isDarkMode = useIsDarkMode()
  const unleashClient = useUnleashClient()

  useAndroidNavigationBarThemeListener()
  useErrorReporting()
  useNetworkStatusListener()
  useWebViewCookies()

  // When the app goes in the background, refresh Unleash feature flags
  useAppStatus({
    onBackground: () => {
      unleashClient.start()
    },
  })

  useEffect(() => {
    GlobalStore.actions.system.incrementLaunchCount()
  }, [])

  useEffect(() => {
    const workAfterRehydrate = async () => {
      await loadUrlMap()
      SplashScreen.hide()
      maybeTrackFirstInstall()
    }

    if (isDoneBooting) {
      workAfterRehydrate()
    }
  }, [isDoneBooting])

  if (!isDoneBooting) {
    return null
  }

  return (
    <Flex backgroundColor="background" flex={1}>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <StackNav.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="HomeTabs"
        >
          {AuthNavigation({ isLoggedIn, selectedPartner })}

          {!!isLoggedIn && !!selectedPartner && (
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

      <StatusBar backgroundColor="background" />
    </Flex>
  )
}
