import { NavigationProp, useNavigation } from "@react-navigation/native"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  Flex,
  Input,
  Spacer,
  Text,
  Touchable,
} from "palette"
import { ShadowSeparator } from "palette/elements/Separator/ShadowSeparator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"

export const CreateAlbum = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const insets = useSafeAreaInsets()
  return (
    <>
      <Flex flex={1} pt={insets.top} px={2} mt={2}>
        <Touchable
          onPress={() => {
            navigation.goBack()
          }}
        >
          <ArrowLeftIcon fill="black100" />
        </Touchable>
        <Flex mt={2} flex={1}>
          <Text variant="lg">Create an Album</Text>
          <Spacer mt={2} />
          <Text caps variant="xs">
            Album name
          </Text>
          <Spacer mt={1} />
          <Flex>
            <Input />
          </Flex>
          <Spacer mt={2} />
          <Flex flexDirection="row" alignItems="center">
            <Text>Add Items to Album</Text>
            <ArrowRightIcon fill="black100" ml="auto" />
          </Flex>
        </Flex>
      </Flex>
      <ShadowSeparator mb={2} />
      <Flex mx={2}>
        <Button width={100} block mb={4}>
          Create
        </Button>
      </Flex>
    </>
  )
}
