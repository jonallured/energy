import { RouteProp, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { Flex, ProgressBar } from "palette"
import { useState } from "react"
import { WebView } from "react-native-webview"

type ArtworkWebViewRoute = RouteProp<HomeTabsScreens, "ArtworkWebView">

export const ArtworkWebView = () => {
  const { uri } = useRoute<ArtworkWebViewRoute>().params
  const [loadProgress, setLoadProgress] = useState<number>(0)
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true)

  return (
    <Flex flex={1} pb={2}>
      <Header safeAreaInsets />
      <WebView
        source={{ uri }}
        onLoadProgress={(e) => setLoadProgress(e.nativeEvent.progress)}
        onLoad={() => setIsProgressBarVisible(false)}
      />
      {isProgressBarVisible && (
        <Flex height="100%">
          <ProgressBar progress={loadProgress} />
        </Flex>
      )}
    </Flex>
  )
}
