import {
  cacheMiddleware,
  loggerMiddleware,
  perfMiddleware,
  RelayNetworkLayer,
} from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes"
import { showLoggerMiddleware, showPerfMiddleware } from "utils/loggers"

const createNetworkLayer = () => {
  /**
   * FIXME: As the following rely on the global store, we can't be sure that
   * it's available at import time and so the below have been moved to lazy
   * imports.
   */
  const { errorMiddleware } = require("../middlewares/errorMiddleware")
  const { authMiddleware } = require("../middlewares/authMiddleware")
  const {
    metaphysicsUrlMiddleware,
  } = require("../middlewares/metaphysicsUrlMiddleware")
  const {
    checkAuthenticationMiddleware,
  } = require("../middlewares/checkAuthenticationMiddleware")

  const network = new RelayNetworkLayer(
    [
      cacheMiddleware({
        size: 100, // max 100 requests
        ttl: 900000, // 15 minutes
      }),
      metaphysicsUrlMiddleware(),
      errorMiddleware(),
      __DEV__ && !__TEST__
        ? showLoggerMiddleware
          ? loggerMiddleware()
          : null
        : null,
      __DEV__ ? (showPerfMiddleware ? perfMiddleware() : null) : null,
      authMiddleware(),
      checkAuthenticationMiddleware(),
    ],
    {
      // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
      // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
      noThrow: true,
    }
  ) // as second arg you may pass advanced options for RRNL

  return network
}

export const createEnvironment = (relayData?: RecordMap) => {
  const environment = new Environment({
    network: createNetworkLayer(),
    store: new Store(new RecordSource(relayData)),
  })

  return environment
}
