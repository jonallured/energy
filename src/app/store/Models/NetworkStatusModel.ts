// import { defaultEnvironment } from "app/relay/environment/defaultEnvironent"
import { action, Action, actionOn, ActionOn } from "easy-peasy"
import { FetchPolicy } from "react-relay"

export interface NetworkStatusModel {
  isOnline: boolean
  relayFetchPolicy: FetchPolicy

  // Actions
  toggleConnected: Action<this, this["isOnline"]>

  // Listeners
  updateRelayFetchPolicyOnConnectivityChange: ActionOn<this>
}

export const getNetworkStatusModel = (): NetworkStatusModel => ({
  isOnline: true,
  relayFetchPolicy: "network-only",

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
        // TODO: Should we set this to store-or-network by default?
        state.relayFetchPolicy = "network-only"
      } else {
        state.relayFetchPolicy = "store-only"
      }
    }
  ),
})
