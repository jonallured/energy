import { Button, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { OfflineModeSync } from "screens/Settings/OfflineMode/OfflineModeSync"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { relayChecksum } from "system/sync/artifacts/__generatedRelayChecksum"
import { getCurrentSyncProgress } from "system/sync/fileCache/getCurrentSyncProgress"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { useIsOnline } from "utils/hooks/useIsOnline"

export const OfflineModeSettings = () => {
  useTrackScreen({ name: "OfflineModeSettings", type: "Settings" })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const offlineSyncedChecksum = GlobalStore.useAppState(
    (state) => state.devicePrefs.offlineSyncedChecksum
  )!
  const { clearCache } = GlobalStore.actions.devicePrefs
  const lastSync = GlobalStore.useAppState((state) => state.devicePrefs.lastSync)
  const isOnline = useIsOnline()
  const showDeveloperOptions = isUserDev || __DEV__

  const [isSyncing, setIsSyncing] = useState(false)
  const [showResumeSyncText, setShowResumeSyncText] = useState(false)

  const isDarkMode = useIsDarkMode()

  const buttonVariant = isDarkMode ? "fillLight" : "fillDark"

  const handleSyncButtonPress = () => {
    setIsSyncing(true)
  }

  const handleClearFileCache = async () => {
    clearCache()

    Alert.alert("Cache cleared.", "", [
      {
        text: "OK",
        style: "cancel",
      },
    ])
  }

  const handleCancelSync = () => {
    setIsSyncing(false)
    setShowResumeSyncText(true)
  }

  useEffect(() => {
    const checkIfAlreadyStartedSync = async () => {
      const currentSyncProgress = await getCurrentSyncProgress()

      if (currentSyncProgress.currentStep > 1) {
        setShowResumeSyncText(true)
      }
    }

    checkIfAlreadyStartedSync()
  }, [])

  return (
    <Screen>
      <Screen.Header onBack={() => navigation.navigate("Settings")} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={1}>
          Offline Mode
        </Text>

        <Text variant="xs" color="onBackgroundMedium">
          Folio can be used when you're not connected to the internet, but you will need to cache
          all the data before you go offline.
        </Text>

        <Spacer y={1} />

        <Text variant="xs" color="onBackgroundMedium">
          If you have over 1,000 artworks uploaded to your CMS, the sync may take several minutes.
          You can resume the sync later at any time.
        </Text>

        <Screen.FullWidthDivider />

        <Join separator={<Screen.FullWidthDivider />}>
          <>
            {isSyncing ? (
              <OfflineModeSync onCancelSync={handleCancelSync} />
            ) : (
              <Button
                mt={1}
                block
                onPress={handleSyncButtonPress}
                disabled={!isOnline}
                variant={buttonVariant}
              >
                {showResumeSyncText ? "Resume sync" : "Start sync"} {isOnline ? "" : " (Offline)"}
              </Button>
            )}

            <Spacer y={1} />

            {!isSyncing && (
              <>
                <Button mt={1} block onPress={handleClearFileCache} variant={buttonVariant}>
                  Clear cache
                </Button>

                {!!lastSync && (
                  <>
                    <Text color="onBackgroundMedium" mt={2}>
                      Last sync: {DateTime.fromISO(lastSync).toLocaleString(DateTime.DATETIME_MED)}
                    </Text>

                    {offlineSyncedChecksum !== relayChecksum && (
                      <>
                        <Text color="red100">
                          Your synced data needs to be refreshed. Please tap the "Start sync" button
                          above.
                        </Text>
                      </>
                    )}
                  </>
                )}

                {!!showDeveloperOptions && (
                  <>
                    <Text color="onBackgroundLow" mt={2}>
                      Last sync: {offlineSyncedChecksum}
                    </Text>
                    <Text color="onBackgroundLow">Current: {relayChecksum}</Text>
                  </>
                )}
              </>
            )}
          </>
        </Join>
      </Screen.Body>
    </Screen>
  )
}
