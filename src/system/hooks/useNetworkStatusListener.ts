import NetInfo, { NetInfoState } from "@react-native-community/netinfo"
import { useEffect } from "react"
import { useSystemRelayEnvironment } from "system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "system/store/GlobalStore"
import { loadRelayDataFromOfflineCache } from "system/sync/syncManager"

/**
 * Attention! This hook should only be used once, right in Navigation.tsx, on
 * app boot. Any further usages will re-register multiple listeners.
 */

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

      GlobalStore.actions.networkStatus.toggleIsLoadingFromOfflineCache(true)

      // If a user has synced data before, load it from disk
      loadRelayDataFromOfflineCache(resetRelayEnvironment, () => {
        setTimeout(() => {
          GlobalStore.actions.networkStatus.toggleIsLoadingFromOfflineCache(
            false
          )
        }, 5000)
      })
    }
  }

  useEffect(() => {
    const unsubscribeToNetworkInfo =
      NetInfo.addEventListener(handleStatusChange)

    return () => {
      unsubscribeToNetworkInfo()
    }
  }, [])
}
