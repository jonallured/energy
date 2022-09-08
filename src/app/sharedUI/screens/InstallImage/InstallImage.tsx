import { RouteProp, useRoute } from "@react-navigation/native"
import { Image } from "react-native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI/Header"
import { Flex } from "palette"

type ImageRoute = RouteProp<HomeTabsScreens, "InstallImage">

export const InstallImage = () => {
  const { params } = useRoute<ImageRoute>()

  return (
    <Flex flex={1} mt={2}>
      <Header safeAreaInsets positionAbsolute />
      <Flex flex={1} justifyContent="center" mb={5}>
        <Image source={{ uri: params.url }} style={{ aspectRatio: 1 }} />
      </Flex>
    </Flex>
  )
}
