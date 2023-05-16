import {
  Spacer,
  Screen,
  Button,
  Text,
  Touchable,
  Flex,
  ArrowRightIcon,
  Join,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { useState } from "react"
import { getVersion } from "react-native-device-info"
import { DevMenu } from "screens/Settings/DevMenu"
import { GlobalStore } from "system/store/GlobalStore"

export const Settings = () => {
  const appVersion = getVersion()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const showDevMenuButtonInternalToggle = GlobalStore.useAppState(
    (state) => state.devicePrefs.showDevMenuButtonInternalToggle
  )
  const [tapCount, updateTapCount] = useState(0)

  return (
    <Screen>
      <Screen.Header onBack={navigation.goBack} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={1}>
          Settings
        </Text>

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

          <Touchable onPress={() => navigation.navigate("EmailSettings")}>
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text>Email</Text>
              <ArrowRightIcon fill="onBackground" />
            </Flex>
          </Touchable>

          <Button block onPress={() => GlobalStore.actions.auth.signOut()}>
            Log out
          </Button>
        </Join>

        {!!isUserDev && (
          <Join separator={<Spacer y={1} />}>
            <Spacer y={2} />
            <Button
              block
              onPress={() =>
                GlobalStore.actions.devicePrefs.setShowDevMenuButton(
                  !showDevMenuButtonInternalToggle
                )
              }
            >
              Toggle Developer Menu
            </Button>

            {!!showDevMenuButtonInternalToggle && <DevMenu />}
          </Join>
        )}

        <Spacer y={2} />

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
                {!!isUserDev && "on Developer mode"}
              </Text>
            </Flex>
          </Touchable>
        </Join>
      </Screen.Body>
    </Screen>
  )
}
