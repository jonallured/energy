import {
  Spacer,
  Button,
  Text,
  Separator,
  Touchable,
  Flex,
  ArrowRightIcon,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useMemo, useState } from "react"
import { Alert } from "react-native"
import { getVersion } from "react-native-device-info"
import { NavigationScreens } from "app/navigation/Main"
import { useSystemRelayEnvironment } from "app/relay/useSystemRelayEnvironment"
import { DevMenu } from "app/screens/Dev/DevMenu"
import { SettingsItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { clearFileCache } from "app/system/sync/fileCache"
import { initSyncManager } from "app/system/sync/syncManager"
import { Screen } from "palette"

export const Settings = () => {
  const { relayEnvironment } = useSystemRelayEnvironment()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const isPresentationModeEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresentationModeEnabled
  )
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)!

  const appVersion = getVersion()

  const [tapCount, updateTapCount] = useState(0)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStatus, setSyncStatus] = useState("")

  const isSyncing = !!syncProgress

  const { startSync } = useMemo(() => {
    return initSyncManager({
      partnerID,
      relayEnvironment,
      onComplete: () => {
        setSyncProgress(0)

        Alert.alert("Sync complete.", "", [
          {
            text: "OK",
            style: "cancel",
          },
        ])
      },
      onProgress: (progress) => {
        setSyncProgress(Math.floor(progress * 100))
      },
      onStatusChange: (message) => {
        setSyncStatus(message)
      },
    })
  }, [partnerID, relayEnvironment])

  const handleSyncButtonPress = async () => {
    try {
      await startSync()
    } catch (error) {
      setSyncProgress(0)

      console.error("Error syncing", error)
    }
  }

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="Settings" />
      <Screen.Body scroll nosafe>
        <Button block onPress={() => navigation.navigate("DarkModeSettings")}>
          Dark Mode
        </Button>
        <Spacer y={2} />
        <SettingsItem title="Presentation Mode">
          <SettingsItem.Toggle
            value={isPresentationModeEnabled}
            onValueChange={() =>
              GlobalStore.actions.presentationMode.toggleIsPresentationModeEnabled()
            }
          />
        </SettingsItem>

        <Spacer y="2" />
        <Touchable onPress={() => navigation.navigate("EditPresentationMode")}>
          <Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text>Presentation Mode Settings</Text>
              <ArrowRightIcon fill="onBackground" />
            </Flex>
            <Text variant="xs" color="onBackgroundMedium">
              Presentation Mode hides sensitive information when showing artworks to clients.
            </Text>
          </Flex>
        </Touchable>

        <Screen.FullWidthItem>
          <Separator my={2} />
        </Screen.FullWidthItem>

        <Touchable onPress={() => navigation.navigate("EmailScreen")}>
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text>Email</Text>
            <ArrowRightIcon fill="onBackground" />
          </Flex>
        </Touchable>

        <Screen.FullWidthItem>
          <Separator my={2} />
        </Screen.FullWidthItem>

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
        <Spacer y="1" />
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

        <Spacer y={1} />

        <Button block onPress={handleSyncButtonPress} disabled={!isOnline}>
          {isSyncing ? (
            <>
              {syncStatus}: {syncProgress}%
            </>
          ) : (
            <>Start Sync {!isOnline && "(Offline)"}</>
          )}
        </Button>

        <Spacer y={1} />

        <Button
          block
          onPress={() => {
            clearFileCache()
          }}
        >
          Clear cache
        </Button>

        <Spacer y={1} />

        <Button
          block
          onPress={() => {
            GlobalStore.actions.networkStatus.toggleConnected(!isOnline)
          }}
        >
          Is Online: {isOnline ? "true" : "false"}
        </Button>

        {isUserDev && <DevMenu />}
      </Screen.Body>
    </Screen>
  )
}
