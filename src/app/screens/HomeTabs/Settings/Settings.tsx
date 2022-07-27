import { ArrowRightIcon, Flex, Separator, Spacer, Text, Touchable, Button } from "palette"
import { BackButton } from "app/sharedUI/molecules/BackButton"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { GlobalStore } from "app/store/GlobalStore"

export const Settings = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <Flex>
      <Flex mx={2} mt={6}>
        <BackButton />
        <Text variant="lg">Settings</Text>
      </Flex>
      {/*
      <Spacer m={2} />
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
    </Flex>
  )
}
