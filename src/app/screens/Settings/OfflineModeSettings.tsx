import { Button, Flex, Join, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { AnimatedEllipsis } from "app/components/AnimatedEllipsis"
import { useSystemRelayEnvironment } from "app/system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "app/system/store/GlobalStore"
import { relayChecksum } from "app/system/sync/_generatedRelayChecksum"
import { clearFileCache } from "app/system/sync/fileCache"
import { initSyncManager } from "app/system/sync/syncManager"
import { useIsOnline } from "app/utils/hooks/useIsOnline"
import { DateTime } from "luxon"
import { Screen } from "palette"
import { useMemo, useState } from "react"
import { Alert } from "react-native"

export const OfflineModeSettings = () => {
  const color = useColor()
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { relayEnvironment } = useSystemRelayEnvironment()

  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const offlineSyncedChecksum = GlobalStore.useAppState(
    (state) => state.devicePrefs.offlineSyncedChecksum
  )!
  const { setOfflineSyncedChecksum } = GlobalStore.actions.devicePrefs
  const lastSync = GlobalStore.useAppState((state) => state.devicePrefs.lastSync)
  const { setLastSync } = GlobalStore.actions.devicePrefs
  const isOnline = useIsOnline()

  const [syncProgress, setSyncProgress] = useState<string | number>(0)
  const [syncStatus, setSyncStatus] = useState("")
  const isSyncing = !!syncProgress

  const { startSync } = useMemo(() => {
    return initSyncManager({
      partnerID,
      relayEnvironment,
      onStart: () => {
        setSyncProgress(1)
      },
      onComplete: () => {
        setSyncProgress(0)
        setOfflineSyncedChecksum(relayChecksum)
        setLastSync(DateTime.now())

        Alert.alert("Sync complete.", "", [
          {
            text: "OK",
            style: "cancel",
          },
        ])
      },
      onProgress: (progress) => {
        setSyncProgress(progress)
      },
      onStatusChange: (message) => {
        setSyncStatus(message)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSyncButtonPress = async () => {
    try {
      await startSync()
    } catch (error) {
      setSyncProgress(0)

      console.error("Error syncing", error)
    }
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

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="Offline Mode" />
      <Screen.Body scroll>
        <Text variant="xs" color="onBackgroundMedium">
          Folio can be used when you're not connected to the internet, but you will need to cache
          all the data before you go offline.
        </Text>

        <Screen.FullWidthDivider />

        <Join separator={<Screen.FullWidthDivider />}>
          <>
            <Button block onPress={handleSyncButtonPress} disabled={!isOnline || syncProgress > 0}>
              {isSyncing ? (
                <Flex flexDirection="row" alignItems="center" justifyContent="center">
                  <Text color="onPrimaryHigh">{syncStatus}</Text>
                  <Text color="onPrimaryHigh">
                    <AnimatedEllipsis
                      style={{
                        color: color("onPrimaryHigh"),
                        position: "relative",
                        top: 1,
                      }}
                    />
                  </Text>
                  <Text ml="2px" color="onPrimaryHigh">
                    {syncProgress}
                  </Text>
                </Flex>
              ) : (
                `Start sync${isOnline ? "" : " (Offline)"}`
              )}
            </Button>

            <Spacer y={1} />

            {lastSync && (
              <Text color="onBackgroundMedium">
                Last sync: {DateTime.fromISO(lastSync).toLocaleString(DateTime.DATETIME_MED)}
              </Text>
            )}

            {lastSync && offlineSyncedChecksum !== relayChecksum && (
              <>
                <Text color="red100">
                  Your synced data needs to be refreshed. Please tap the "Start sync" button above.
                </Text>
              </>
            )}

            {(isUserDev || __DEV__) && (
              <>
                <Text color="onBackgroundLow">Last sync: {offlineSyncedChecksum}</Text>
                <Text color="onBackgroundLow">Current: {relayChecksum}</Text>
              </>
            )}
          </>

          <Button block onPress={handleClearFileCache}>
            Clear cache
          </Button>

          {(isUserDev || __DEV__) && (
            <Button block onPress={() => navigation.navigate("BrowseOfflineCache")}>
              Browse offline cache
            </Button>
          )}
        </Join>
      </Screen.Body>
    </Screen>
  )
}
