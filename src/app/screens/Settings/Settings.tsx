import { Spacer, Button, Text, Touchable, Flex, ArrowRightIcon, Join } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { getVersion } from "react-native-device-info"
import { NavigationScreens } from "app/Navigation"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"

export const Settings = () => {
  const appVersion = getVersion()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const showDevMenuButtonInternalToggle = GlobalStore.useAppState(
    (state) => state.devicePrefs.showDevMenuButtonInternalToggle
  )
  const { setShowDevMenuButton } = GlobalStore.actions.devicePrefs
  const [tapCount, updateTapCount] = useState(0)

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="Settings" />
      <Screen.Body scroll nosafe>
        <Screen.FullWidthDivider />

        <Join separator={<Screen.FullWidthDivider />}>
          <Touchable onPress={() => navigation.navigate("DarkModeSettings")}>
            <Flex>
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Text>Dark Mode</Text>
                <ArrowRightIcon fill="onBackground" />
              </Flex>
            </Flex>
          </Touchable>

          <Touchable onPress={() => navigation.navigate("PresentationModeSettings")}>
            <Flex>
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Text>Presentation Mode</Text>
                <ArrowRightIcon fill="onBackground" />
              </Flex>
              <Text variant="xs" color="onBackgroundMedium">
                Presentation Mode hides sensitive information when showing artworks to clients.
              </Text>
            </Flex>
          </Touchable>

          <Touchable onPress={() => navigation.navigate("OfflineModeSettings")}>
            <Flex>
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Text>Offline Mode</Text>
                <ArrowRightIcon fill="onBackground" />
              </Flex>
              <Text variant="xs" color="onBackgroundMedium">
                Folio can be used when you're not connected to the internet, but you will need to
                cache all the data before you go offline
              </Text>
            </Flex>
          </Touchable>

          <Touchable onPress={() => navigation.navigate("EmailScreen")}>
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text>Email</Text>
              <ArrowRightIcon fill="onBackground" />
            </Flex>
          </Touchable>

          <Button block onPress={() => void GlobalStore.actions.auth.signOut()}>
            Log out
          </Button>
        </Join>

        {isUserDev && (
          <Join separator={<Spacer y={1} />}>
            <Spacer y="2" />
            <Button block onPress={() => navigation.navigate("FolioDesignLanguage")}>
              Folio Design Language
            </Button>
            <Button block onPress={() => navigation.navigate("InsteadOfStorybook")}>
              Instead of Storybook
            </Button>
            <Button block onPress={() => setShowDevMenuButton(!showDevMenuButtonInternalToggle)}>
              Toggle DevMenu button (just shake on ios)
            </Button>
          </Join>
        )}

        <Spacer y="2" />

        <Join separator={<Spacer y={1} />}>
          <Touchable
            onPress={() => {
              if (tapCount < 5) {
                updateTapCount(tapCount + 1)
              } else {
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
        </Join>
      </Screen.Body>
    </Screen>
  )
}
