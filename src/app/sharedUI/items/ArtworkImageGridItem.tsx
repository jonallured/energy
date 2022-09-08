import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Image } from "react-native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Flex, Touchable } from "palette"

interface ArtworkImageGridItemProps {
  url: string
}

export const ArtworkImageGridItem: React.FC<ArtworkImageGridItemProps> = ({ url }) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <Touchable
      testID={url}
      onPress={() =>
        navigation.navigate("InstallImage", {
          url,
        })
      }
    >
      <Flex mb={4} pl={2}>
        <Image source={{ uri: url }} style={{ aspectRatio: 1 }} />
      </Flex>
    </Touchable>
  )
}
