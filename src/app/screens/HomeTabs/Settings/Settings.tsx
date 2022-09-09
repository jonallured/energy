import { useNavigation } from "@react-navigation/native"
import { DevMenu } from "app/screens/Dev/DevMenu"
import { Header } from "app/sharedUI"
import { SwitchContainer } from "app/sharedUI/molecules/SwitchContainer"
import { GlobalStore } from "app/store/GlobalStore"
import { Spacer, Button, Screen, Text, Separator, Touchable, Flex, ArrowRightIcon } from "palette"

export const Settings = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const isPresenationModeEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresenationModeEnabled
  )

  return (
    <Screen>
      <Screen.RawHeader>
        <Header label="Settings" />
      </Screen.RawHeader>
      <Screen.Body>
        <Spacer y={2} />
        <Button block onPress={() => navigation.navigate("DarkModeSettings")}>
          Dark Mode
        </Button>
        <Spacer y={2} />
        <SwitchContainer
          label="Presentation Mode"
          onValueChange={() =>
            GlobalStore.actions.presentationMode.toggleIsPresenationModeEnabled()
          }
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
            <Text variant="xs" color="onBackgroundMedium">
              Presentation Mode hides sensitive information when showing artworks to clients.
            </Text>
          </Flex>
        </Touchable>
        <Spacer m={1} />
        <Separator />

        <Button block onPress={() => void GlobalStore.actions.auth.signOut()}>
          Log out
        </Button>

        <Spacer y={1} />
        <Button block onPress={() => navigation.navigate("FolioDesignLanguage")}>
          Folio Design Language
        </Button>
        <Spacer y={1} />
        <Button block onPress={() => navigation.navigate("InsteadOfStorybook")}>
          Instead Of Storybook
        </Button>
        <Spacer y={1} />
        <DevMenu />
      </Screen.Body>
    </Screen>
  )
}
