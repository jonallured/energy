import { RouteProp, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { Flex } from "palette"
import { WebView } from "react-native-webview"

type ArtworkWebViewRoute = RouteProp<HomeTabsScreens, "ArtworkWebView">

export const ArtworkWebView = () => {
  const { uri } = useRoute<ArtworkWebViewRoute>().params

  return (
    <Flex flex={1} pb={2}>
      <Header />
      <WebView source={{ uri }} />
    </Flex>
  )
}
