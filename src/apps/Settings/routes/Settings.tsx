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
import { DevMenu } from "apps/Settings/routes/DevMenu/DevMenu"
import { useState } from "react"
import { getVersion } from "react-native-device-info"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const Settings = () => {
  useTrackScreen({ name: "Settings", type: "Settings" })

  const appVersion = getVersion()
  const { router } = useRouter()

  const isUserDev = GlobalStore.useAppState(
    (state) => state.artsyPrefs.isUserDev
  )
  const showDevMenuButtonInternalToggle = GlobalStore.useAppState(
    (state) => state.devicePrefs.showDevMenuButtonInternalToggle
  )
  const [tapCount, updateTapCount] = useState(0)

  const isDarkMode = useIsDarkMode()

  return (
    <Screen>
      <Screen.Header onBack={router.goBack} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={1}>
          Settings
        </Text>

        <Screen.FullWidthDivider />

        <Join separator={<Screen.FullWidthDivider />}>
          <Touchable onPress={() => router.navigate("DarkModeSettings")}>
            <Flex>
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>Dark Mode</Text>
                <ArrowRightIcon fill="onBackground" />
              </Flex>
            </Flex>
          </Touchable>

          <Touchable
            onPress={() => router.navigate("PresentationModeSettings")}
          >
            <Flex>
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>Presentation Mode</Text>
                <ArrowRightIcon fill="onBackground" />
              </Flex>
              <Text variant="xs" color="onBackgroundMedium">
                Presentation Mode hides sensitive information when showing
                artworks to clients.
              </Text>
            </Flex>
          </Touchable>

          <Touchable onPress={() => router.navigate("OfflineModeSettings")}>
            <Flex>
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>Offline Mode</Text>
                <ArrowRightIcon fill="onBackground" />
              </Flex>
              <Text variant="xs" color="onBackgroundMedium">
                Folio can be used when you're not connected to the internet, but
                you will need to cache all the data before you go offline
              </Text>
            </Flex>
          </Touchable>

          <Touchable onPress={() => router.navigate("EmailSettings")}>
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>Email</Text>
              <ArrowRightIcon fill="onBackground" />
            </Flex>
          </Touchable>

          <Button
            block
            variant={isDarkMode ? "fillLight" : "fillDark"}
            onPress={() => GlobalStore.actions.auth.signOut()}
          >
            Log out
          </Button>
        </Join>

        {!!isUserDev && (
          <Join separator={<Spacer y={1} />}>
            <Spacer y={2} />
            <Button
              block
              variant={isDarkMode ? "fillLight" : "fillDark"}
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
