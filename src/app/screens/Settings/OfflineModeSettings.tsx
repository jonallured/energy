import { Button, Join, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useMemo, useState } from "react"
import { Alert } from "react-native"
import { NavigationScreens } from "app/Navigation"
import { AnimatedEllipsis } from "app/components/AnimatedEllipsis"
import { useSystemRelayEnvironment } from "app/system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "app/system/store/GlobalStore"
import { relayChecksum } from "app/system/sync/_generatedRelayChecksum"
import { clearFileCache } from "app/system/sync/fileCache"
import { initSyncManager } from "app/system/sync/syncManager"
import { useIsOnline } from "app/utils/hooks/useIsOnline"
import { Screen } from "palette"

export const OfflineModeSettings = () => {
  const color = useColor()
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { relayEnvironment } = useSystemRelayEnvironment()

  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const offlineSyncedChecksum = GlobalStore.useAppState((state) => state.offlineSyncedChecksum)!
  const setOfflineSyncedChecksum = GlobalStore.actions.setOfflineSyncedChecksum
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
                <>
                  <Text color="onPrimaryHigh">
                    {syncStatus}
                    <AnimatedEllipsis
                      style={{
                        color: color("onPrimaryHigh"),
                      }}
                    />{" "}
                    {syncProgress}
                  </Text>
                </>
              ) : (
                `Start sync${isOnline ? "" : " (Offline)"}`
              )}
            </Button>
            {offlineSyncedChecksum !== relayChecksum && (
              <>
                <Spacer y="1" />
                <Text color="red100">
                  Your synced data needs to be refreshed. Please tap the "Start sync" button above.
                </Text>
              </>
            )}
            {(isUserDev || __DEV__) && (
              <>
                <Spacer y="1" />
                <Text color="onBackgroundLow">Latest synced: {offlineSyncedChecksum}</Text>
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
