import { Button, Flex, Join, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { AnimatedEllipsis } from "components/AnimatedEllipsis"
import { Screen } from "components/Screen"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { Alert } from "react-native"
import JSONTree from "react-native-json-tree"
import { useSystemRelayEnvironment } from "system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "system/store/GlobalStore"
import { relayChecksum } from "system/sync/artifacts/__generatedRelayChecksum"
import { getURLMap, loadUrlMap } from "system/sync/fileCache"
import { clearFileCache } from "system/sync/fileCache/clearFileCache"
import { initSyncManager, SyncResultsData } from "system/sync/syncManager"
import { useIsOnline } from "utils/hooks/useIsOnline"

export const OfflineModeSettings = () => {
  const color = useColor()
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const { relayEnvironment } = useSystemRelayEnvironment()

  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const offlineSyncedChecksum = GlobalStore.useAppState(
    (state) => state.devicePrefs.offlineSyncedChecksum
  )!
  const { setOfflineSyncedChecksum } = GlobalStore.actions.devicePrefs
  const lastSync = GlobalStore.useAppState((state) => state.devicePrefs.lastSync)
  const { setLastSync } = GlobalStore.actions.devicePrefs
  const isOnline = useIsOnline()

  const [urlMap, setURLMap] = useState<Record<string, string> | {}>({})

  const [syncResultsData, setSyncResults] = useState<SyncResultsData | {}>({})
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
      onSyncResultsChange: (results) => {
        setSyncResults(results)
      },
    })
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
      <Screen.Header title="Offline Mode" />
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

          <Button
            block
            onPress={async () => {
              await loadUrlMap()
              const updatedURLMap = getURLMap()
              setURLMap(updatedURLMap)
            }}
          >
            Show URL Map
          </Button>

          {__DEV__ && <JSONTree data={syncResultsData as Record<string, string>} />}

          {__DEV__ && urlMap && <JSONTree data={urlMap} />}
        </Join>
      </Screen.Body>
    </Screen>
  )
}
