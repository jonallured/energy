import { ArrowRightIcon, Flex, Separator, Spacer, Text, Touchable, Button } from "palette"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { GlobalStore } from "app/store/GlobalStore"
import { Header } from "app/sharedUI"
import { SwitchContainer } from "app/sharedUI/molecules/SwitchContainer"

export const Settings = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const isPresenationModeEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresenationModeEnabled
  )

  return (
    <>
      <Header label="Settings" />
      <Spacer m={1} />
      <SwitchContainer
        label="Presentation Mode"
        onValueChange={() => GlobalStore.actions.presentationMode.toggleIsPresenationModeEnabled()}
        value={isPresenationModeEnabled}
      />
      <Spacer m={1} />
      <Separator />
      <Spacer m={1} />
      <Touchable onPress={() => navigation.navigate("EditPresentationMode")}>
        <Flex mx={2}>
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text>Presentation Mode Settings</Text>
            <ArrowRightIcon />
          </Flex>
          <Text variant="xs" color="black60">
            Presentation Mode hides sensitive information when showing artworks to clients.
          </Text>
        </Flex>
      </Touchable>
      <Spacer m={1} />
      <Separator />
      {/* <Spacer m={1} />
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
