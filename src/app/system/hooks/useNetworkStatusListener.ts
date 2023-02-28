import NetInfo, { NetInfoState } from "@react-native-community/netinfo"
import { useSystemRelayEnvironment } from "app/system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "app/system/store/GlobalStore"
import { loadRelayDataFromOfflineCache } from "app/system/sync/syncManager"
import { useEffect } from "react"

export const useNetworkStatusListener = () => {
  const { resetRelayEnvironment } = useSystemRelayEnvironment()

  const handleStatusChange = (state: NetInfoState) => {
    GlobalStore.actions.networkStatus.toggleConnected(state.isConnected!)

    if (state.isConnected) {
      console.log("[network-status]: Online.")

      // Reset store to clear out any stale data
      resetRelayEnvironment()
    } else {
      console.log("[network-status]: Offline.")

      // If a user has synced data before, load it from disk
      loadRelayDataFromOfflineCache(resetRelayEnvironment)
    }
  }

  useEffect(() => {
    const unsubscribeToNetworkInfo = NetInfo.addEventListener(handleStatusChange)

    return () => {
      unsubscribeToNetworkInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
