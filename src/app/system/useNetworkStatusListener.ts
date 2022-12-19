import NetInfo, { NetInfoState } from "@react-native-community/netinfo"
import { throttle } from "lodash"
import { useEffect } from "react"
import { useSystemRelayEnvironment } from "app/relay/useSystemRelayEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { loadRelayDataFromOfflineCache } from "./sync/syncManager"

export const useNetworkStatusListener = () => {
  const { resetRelayEnvironment } = useSystemRelayEnvironment()

  const handleStatusChange = throttle(
    (state: NetInfoState) => {
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
    },
    1000,
    { leading: true }
  )

  useEffect(() => {
    const unsubscribeToNetworkInfo = NetInfo.addEventListener(handleStatusChange)

    return () => {
      unsubscribeToNetworkInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
