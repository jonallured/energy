// import { defaultEnvironment } from "relay/environment/defaultEnvironent"
import { action, Action, actionOn, ActionOn } from "easy-peasy"
import { FetchPolicy } from "react-relay"

export interface NetworkStatusModel {
  sessionState: {
    isLoadingFromOfflineCache: boolean
  }

  isOnline: boolean
  relayFetchKey: number
  relayFetchPolicy: FetchPolicy

  // Actions
  toggleIsLoadingFromOfflineCache: Action<this, boolean>
  toggleConnected: Action<this, this["isOnline"]>

  // Listeners
  updateRelayFetchPolicyOnConnectivityChange: ActionOn<this>

  setRelayFetchKey: Action<this>
}

export const getNetworkStatusModel = (): NetworkStatusModel => ({
  sessionState: {
    isLoadingFromOfflineCache: false,
  },

  isOnline: true,
  relayFetchKey: 0,
  relayFetchPolicy: "store-or-network",

  toggleIsLoadingFromOfflineCache: action((state, isLoading) => {
    state.sessionState.isLoadingFromOfflineCache = isLoading
  }),

  toggleConnected: action((state, isOnline) => {
    state.isOnline = isOnline
  }),

  setRelayFetchKey: action((state) => {
    state.relayFetchKey += 1
  }),

  // Listeners

  /**
   * When the network status changes, update the fetch policy for our relay
   * system query renderers.
   */
  updateRelayFetchPolicyOnConnectivityChange: actionOn(
    (actions) => actions.toggleConnected,
    (state) => {
      if (state.isOnline) {
        state.relayFetchPolicy = "store-or-network"
      } else {
        state.relayFetchPolicy = "store-only"
      }
    }
  ),
})
