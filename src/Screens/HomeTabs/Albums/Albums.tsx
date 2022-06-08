import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Button, Flex } from "palette"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"

export const Albums = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  return (
    <TabsFlatList
      data={[0]}
      renderItem={() => (
        <Flex mx={2}>
          <Button
            width={100}
            block
            onPress={() => {
              navigation.navigate("CreateAlbum")
            }}
          >
            Create New Album
          </Button>
        </Flex>
      )}
    />
  )
}
