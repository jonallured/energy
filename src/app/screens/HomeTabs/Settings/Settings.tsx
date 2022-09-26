import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { getVersion } from "react-native-device-info"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
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
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)

  const appVersion = getVersion()
  const [tapCount, updateTapCount] = useState(0)

  return (
    <Screen>
      <Screen.RawHeader>
        <Header label="Settings" />
      </Screen.RawHeader>
      <Screen.Body fullwidth>
        <Spacer y={2} />
        <Flex mx={2}>
          <Button block onPress={() => navigation.navigate("DarkModeSettings")}>
            Dark Mode
          </Button>
        </Flex>
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
        <Separator my={2} />

        <Touchable onPress={() => navigation.navigate("EmailScreen")}>
          <Flex mx={2} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text>Email</Text>
            <ArrowRightIcon />
          </Flex>
        </Touchable>
        <Separator my={2} />

        <Spacer m={2} />
        <Flex mx={2}>
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
        </Flex>
        <Spacer m={1} />
        <Touchable
          onPress={() => {
            if (tapCount < 5) updateTapCount(tapCount + 1)
            else {
              GlobalStore.actions.artsyPrefs.switchIsUserDev()
              updateTapCount(0)
            }
          }}
        >
          <Flex alignItems="center">
            <Text variant="xs" color="onBackgroundMedium">
              App version: {appVersion}
            </Text>
            <Text variant="xs" color="onBackgroundMedium">
              {isUserDev && "on Developer mode"}
            </Text>
          </Flex>
        </Touchable>
        {isUserDev && <DevMenu />}
      </Screen.Body>
    </Screen>
  )
}
