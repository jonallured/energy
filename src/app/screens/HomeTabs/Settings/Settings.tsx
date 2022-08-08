import { ArrowRightIcon, Flex, Separator, Spacer, Text, Touchable, Button } from "palette"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { GlobalStore } from "app/store/GlobalStore"
import { Header } from "app/sharedUI"

export const Settings = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <>
      <Header label="Settings" />

      {/* <Spacer m={2} />
      <Separator />
      <Spacer m={1} />
      <Flex mx={2}>
        <Touchable onPress={() => navigation.navigate("DarkModeSettings")}>
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text>Dark Mode</Text>
            <ArrowRightIcon />
          </Flex>
        </Touchable>
      </Flex>
      <Spacer m={1} />
      <Separator /> */}
      <Spacer m={2} />

      <Flex mx={2} alignItems="center">
        <Button
          block
          onPress={() => {
            GlobalStore.actions.auth.signOut()
          }}
        >
          Log out
        </Button>
      </Flex>
    </>
  )
}
