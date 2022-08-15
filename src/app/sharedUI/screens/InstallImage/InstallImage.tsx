import { RouteProp, useRoute } from "@react-navigation/native"
import { Flex } from "palette"
import { Header } from "app/sharedUI/Header"

import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Image } from "react-native"

type ImageRoute = RouteProp<HomeTabsScreens, "InstallImage">

export const InstallImage = () => {
  const { params } = useRoute<ImageRoute>()

  return (
    <Flex flex={1} mt={2}>
      <Header safeAreaInsets />
      <Flex flex={1} justifyContent="center" mb={5}>
        <Image source={{ uri: params.url }} style={{ aspectRatio: 1 }} />
      </Flex>
    </Flex>
  )
}
