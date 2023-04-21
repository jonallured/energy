import { Button, Flex, Join, ProgressBar, Spacer, Text } from "@artsy/palette-mobile"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { activateKeepAwake, deactivateKeepAwake } from "@sayem314/react-native-keep-awake"
import { Screen } from "components/Screen"
import { DateTime } from "luxon"
import { useEffect, useMemo, useState } from "react"
import { Alert } from "react-native"
import JSONTree from "react-native-json-tree"
import { useSystemRelayEnvironment } from "system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "system/store/GlobalStore"
import { relayChecksum } from "system/sync/artifacts/__generatedRelayChecksum"
import { getURLMap, loadUrlMap } from "system/sync/fileCache"
import { initSyncManager, SyncResultsData } from "system/sync/syncManager"

interface OfflineModeSyncProps {
  onCancelSync: () => void
}

export const OfflineModeSync: React.FC<OfflineModeSyncProps> = ({ onCancelSync }) => {
  const navigation = useNavigation()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)
  const offlineSyncedChecksum = GlobalStore.useAppState(
    (state) => state.devicePrefs.offlineSyncedChecksum
  )!
  const { setOfflineSyncedChecksum, setLastSync } = GlobalStore.actions.devicePrefs
  const { relayEnvironment } = useSystemRelayEnvironment()

  const [syncResultsData, setSyncResultsChange] = useState<SyncResultsData | {}>({})
  const [urlMap, setURLMap] = useState<Record<string, string> | {}>({})
  const [statusChange, setStatusChange] = useState("")
  const [stepChange, setStepChange] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  })
  const [progressChange, setOnProgressChange] = useState(0)
  const [onAbort, setOnAbort] = useState<(() => void) | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const { startSync } = useMemo(() => {
    return initSyncManager({
      partnerID,
      relayEnvironment,
      onStart: () => {
        setIsSyncing(true)
        activateKeepAwake()
      },
      onComplete: () => {
        setOfflineSyncedChecksum(relayChecksum)
        setLastSync(DateTime.now())
        deactivateKeepAwake()

        Alert.alert("Sync complete.", "", [
          {
            text: "OK",
            style: "cancel",
            onPress: () => {
              navigation.goBack()
            },
          },
        ])
      },
      onAbort: (onAbortHandler) => {
        setOnAbort(onAbortHandler)
      },
      onStepChange: setStepChange,
      onProgressChange: setOnProgressChange,
      onStatusChange: setStatusChange,
      onSyncResultsChange: setSyncResultsChange,
    })
  }, [])

  const handleStartSync = async () => {
    await startSync()
  }

  // Start on mount
  useEffect(() => {
    handleStartSync()
  }, [])

  const handleCancelSync = () => {
    if (isSyncing) {
      deactivateKeepAwake()
      onAbort?.()
      setIsSyncing(false)
      onCancelSync()
    }
  }

  const showDeveloperOptions = isUserDev || __DEV__

  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused && isSyncing) {
      handleCancelSync()
    }
  }, [isFocused])

  return (
    <>
      {isSyncing && (
        <Join separator={<Spacer y={2} />}>
          <Text>Sync in progress...</Text>

          <Flex flexDirection="row">
            <Text ml="2px">
              Step {stepChange.current} of {stepChange.total}: {statusChange}
            </Text>
          </Flex>

          <ProgressBar
            progress={progressChange}
            animationDuration={progressChange === 0 ? 0 : 200}
          />

          <Button block onPress={handleCancelSync}>
            Cancel Sync
          </Button>
        </Join>
      )}

      {!showDeveloperOptions && (
        <>
          <Screen.FullWidthDivider />

          <Button block onPress={handleStartSync}>
            Start sync
          </Button>

          <Spacer y={1} />

          {showDeveloperOptions && (
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
          )}

          {showDeveloperOptions && (
            <>
              <Text color="onBackgroundLow">Last sync: {offlineSyncedChecksum}</Text>
              <Text color="onBackgroundLow">Current: {relayChecksum}</Text>
            </>
          )}

          {showDeveloperOptions && <JSONTree data={syncResultsData as Record<string, string>} />}
          {showDeveloperOptions && urlMap && <JSONTree data={urlMap} />}
        </>
      )}
    </>
  )
}