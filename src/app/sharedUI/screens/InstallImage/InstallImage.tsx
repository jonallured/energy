import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Image } from "react-native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Flex, Screen } from "palette"

type ImageRoute = RouteProp<HomeTabsScreens, "InstallImage">

export const InstallImage = () => {
  const { params } = useRoute<ImageRoute>()
  const navigation = useNavigation()

  return (
    <Screen>
      <Screen.HeaderFloatingBackButton onBack={navigation.goBack} />
      <Screen.Body fullwidth>
        <Flex flex={1} justifyContent="center">
          <Image source={{ uri: params.url }} style={{ aspectRatio: 1 }} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
