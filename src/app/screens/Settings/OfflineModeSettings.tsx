import { Button, Join, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useMemo, useState } from "react"
import { Alert } from "react-native"
import AnimatedEllipsis from "react-native-animated-ellipsis"
import { NavigationScreens } from "app/Navigation"
import { useSystemRelayEnvironment } from "app/system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "app/system/store/GlobalStore"
import { clearFileCache } from "app/system/sync/fileCache"
import { initSyncManager } from "app/system/sync/syncManager"
import { Screen } from "palette"

export const OfflineModeSettings = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { relayEnvironment } = useSystemRelayEnvironment()

  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)!

  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStatus, setSyncStatus] = useState("")
  const isSyncing = !!syncProgress

  const { startSync } = useMemo(() => {
    return initSyncManager({
      partnerID,
      relayEnvironment,
      onStart: () => {
        setSyncProgress(0.01)
      },
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
          <Button block onPress={handleSyncButtonPress} disabled={!isOnline || syncProgress > 0}>
            {isSyncing ? (
              <>
                <Text color="black100" py={0}>
                  {syncStatus}
                  <AnimatedEllipsis
                    numberOfDots={3}
                    minOpacity={0.3}
                    animationDelay={200}
                    style={{
                      color: "#000",
                      letterSpacing: -1,
                    }}
                  />{" "}
                  {syncProgress}%
                </Text>
              </>
            ) : (
              <>Start Sync {!isOnline && "(Offline)"}</>
            )}
          </Button>

          <Button block onPress={handleClearFileCache}>
            Clear cache
          </Button>

          {__DEV__ && (
            <Button block onPress={() => navigation.navigate("BrowseOfflineCache")}>
              Browse offline cache
            </Button>
          )}
        </Join>
      </Screen.Body>
    </Screen>
  )
}
