import { Flex, ProgressBar, Screen } from "@artsy/palette-mobile"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { useState } from "react"
import { WebView } from "react-native-webview"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

type ArtworkWebViewRoute = RouteProp<NavigationRoutes, "ArtworkWebView">

export const ArtworkWebView = () => {
  const navigation = useNavigation()
  const { params } = useRoute<ArtworkWebViewRoute>()
  const { webURL } = GlobalStore.useAppState(
    (store) => store.config.environment.strings
  )
  const [loadProgress, setLoadProgress] = useState<number>(0)
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true)
  const uri = params.uri.startsWith("/") ? webURL + params.uri : params.uri

  useTrackScreen({
    name: "ArtworkWebView",
    type: "Artwork",
    slug: params.slug,
    internalID: params.internalID,
  })

  return (
    <Screen>
      <Screen.Header onBack={navigation.goBack} />
      <Screen.Body fullwidth>
        <WebView
          source={{ uri }}
          sharedCookiesEnabled
          onLoadProgress={(e) => setLoadProgress(e.nativeEvent.progress)}
          onLoad={() => setIsProgressBarVisible(false)}
        />
        <Flex
          display={isProgressBarVisible ? "flex" : "none"}
          position="absolute"
          top={0}
          width="100%"
        >
          <ProgressBar progress={loadProgress} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
