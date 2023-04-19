import { Button, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { Screen } from "components/Screen"
import { DateTime } from "luxon"
import { useState } from "react"
import { Alert } from "react-native"
import { OfflineModeSync } from "screens/Settings/OfflineMode/OfflineModeSync"
import { GlobalStore } from "system/store/GlobalStore"
import { relayChecksum } from "system/sync/artifacts/__generatedRelayChecksum"
import { clearFileCache } from "system/sync/fileCache/clearFileCache"
import { useIsOnline } from "utils/hooks/useIsOnline"

export const OfflineModeSettings = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const offlineSyncedChecksum = GlobalStore.useAppState(
    (state) => state.devicePrefs.offlineSyncedChecksum
  )!
  const { setOfflineSyncedChecksum } = GlobalStore.actions.devicePrefs
  const lastSync = GlobalStore.useAppState((state) => state.devicePrefs.lastSync)
  const { setLastSync } = GlobalStore.actions.devicePrefs
  const isOnline = useIsOnline()
  const showDeveloperOptions = isUserDev || __DEV__
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSyncButtonPress = () => {
    // navigation.navigate("OfflineModeSync")
    setIsSyncing(true)
  }

  const handleClearFileCache = async () => {
    await clearFileCache()
    setOfflineSyncedChecksum(null)
    setLastSync(null)

    Alert.alert("Cache cleared.", "", [
      {
        text: "OK",
        style: "cancel",
      },
    ])
  }

  const handleCancelSync = () => {
    navigation.navigate("Settings")
  }

  return (
    <Screen>
      <Screen.Header onBack={handleCancelSync} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={2}>
          Offline Mode
        </Text>

        <Text variant="xs" color="onBackgroundMedium">
          Folio can be used when you're not connected to the internet, but you will need to cache
          all the data before you go offline.
        </Text>

        <Screen.FullWidthDivider />

        <Join separator={<Screen.FullWidthDivider />}>
          <>
            {isSyncing ? (
              <OfflineModeSync onCancelSync={handleCancelSync} />
            ) : (
              <Button mt={1} block onPress={handleSyncButtonPress} disabled={!isOnline}>
                Start sync {isOnline ? "" : " (Offline)"}
              </Button>
            )}

            <Spacer y={1} />

            {!isSyncing && (
              <>
                {lastSync && (
                  <Text color="onBackgroundMedium" mt={2}>
                    Last sync: {DateTime.fromISO(lastSync).toLocaleString(DateTime.DATETIME_MED)}
                  </Text>
                )}

                {lastSync && offlineSyncedChecksum !== relayChecksum && (
                  <>
                    <Text color="red100">
                      Your synced data needs to be refreshed. Please tap the "Start sync" button
                      above.
                    </Text>
                  </>
                )}

                {!showDeveloperOptions && (
                  <>
                    <Text color="onBackgroundLow">Last sync: {offlineSyncedChecksum}</Text>
                    <Text color="onBackgroundLow">Current: {relayChecksum}</Text>
                  </>
                )}

                <Button mt={1} block onPress={handleClearFileCache}>
                  Clear cache
                </Button>
              </>
            )}
          </>
        </Join>
      </Screen.Body>
    </Screen>
  )
}
