import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeftIcon, Flex, Touchable } from "palette"
import { Header } from "app/sharedUI/Header"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Image } from "react-native"

type ImageRoute = RouteProp<HomeTabsScreens, "InstallImage">

export const InstallImage = () => {
  const { params } = useRoute<ImageRoute>()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <Flex flex={1} mt={2}>
      <Header />
      <Flex flex={1} justifyContent="center" mb={5}>
        <Image source={{ uri: params.url }} style={{ aspectRatio: 1 }} />
      </Flex>
    </Flex>
  )
}
