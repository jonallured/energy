import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Button, Flex } from "palette"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { TabsScrollView } from "app/wrappers/TabsTestWrappers"

export const Albums = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  return (
    <TabsScrollView>
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
    </TabsScrollView>
  )
}
