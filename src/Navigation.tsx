import { Flex } from "@artsy/palette-mobile"
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useUnleashClient } from "@unleash/proxy-client-react"
import { AlbumsRouter, AlbumRoutes } from "apps/Albums/albumsRoutes"
import { ArtistsRouter, ArtistRoutes } from "apps/Artists/artistsRoutes"
import { ArtworkRouter, ArtworkRoutes } from "apps/Artwork/artworkRoutes"
import { AuthRoutes, AuthRouter } from "apps/Auth/authRoutes"
import {
  ConversationsRouter,
  ConversationsRoutes,
} from "apps/Conversations/conversationsRoutes"
import { HomeTabs } from "apps/HomeTabs"
import { SearchRouter, SearchRoutes } from "apps/Search/searchRoutes"
import { SettingsRouter, SettingsRoutes } from "apps/Settings/settingsRoutes"
import { ShowsRouter, ShowsRoutes } from "apps/Shows/showsRoutes"
import { StatusBar } from "components/StatusBar"
import { useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
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

export type NavigationRoutes = AuthRoutes &
  AlbumRoutes &
  ArtworkRoutes &
  ArtistRoutes &
  ConversationsRoutes &
  SettingsRoutes &
  SearchRoutes &
  ShowsRoutes &
  OtherRoutes

type OtherRoutes = {
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

export type RouteNames = keyof NavigationRoutes

export const StackNav = createNativeStackNavigator<NavigationRoutes>()

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
          {AuthRouter({ isLoggedIn, selectedPartner })}

          {!!isLoggedIn && !!selectedPartner && (
            <>
              <StackNav.Screen name="HomeTabs" component={HomeTabs} />

              {AlbumsRouter()}
              {ArtistsRouter()}
              {ArtworkRouter()}
              {ConversationsRouter()}
              {SearchRouter()}
              {SettingsRouter()}
              {ShowsRouter()}
            </>
          )}
        </StackNav.Navigator>
      </NavigationContainer>

      <StatusBar backgroundColor="background" />
    </Flex>
  )
}
