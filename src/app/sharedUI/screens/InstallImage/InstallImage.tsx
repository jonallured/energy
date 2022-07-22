import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeftIcon, Flex, Touchable } from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { Image } from "react-native"

type ImageRoute = RouteProp<HomeTabsScreens, "InstallImage">

export const InstallImage = () => {
  const { params } = useRoute<ImageRoute>()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <Flex flex={1} pt={insets.top} mt={2}>
      <Flex px={2}>
        <Touchable
          onPress={() =>  navigation.goBack()}
        >
          <ArrowLeftIcon fill="black100" />
        </Touchable>
      </Flex>

      <Flex flex={1} justifyContent="center">
        <Image source={{ uri: params.url }} style={{ aspectRatio: 1 }} />
      </Flex>
    </Flex>
  )
}
