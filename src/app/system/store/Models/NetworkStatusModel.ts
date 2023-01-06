// import { defaultEnvironment } from "app/relay/environment/defaultEnvironent"
import { action, Action, actionOn, ActionOn } from "easy-peasy"
import { FetchPolicy } from "react-relay"

export interface NetworkStatusModel {
  isOnline: boolean
  relayFetchKey: number
  relayFetchPolicy: FetchPolicy

  // Actions
  toggleConnected: Action<this, this["isOnline"]>

  // Listeners
  updateRelayFetchPolicyOnConnectivityChange: ActionOn<this>

  setRelayFetchKey: Action<this>
}

export const getNetworkStatusModel = (): NetworkStatusModel => ({
  isOnline: true,
  relayFetchKey: 0,
  relayFetchPolicy: "store-or-network",

  toggleConnected: action((state, isOnline) => {
    state.isOnline = isOnline
  }),

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

  setRelayFetchKey: action((state) => {
    state.relayFetchKey += 1
  }),
})
