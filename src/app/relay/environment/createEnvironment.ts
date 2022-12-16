import {
  cacheMiddleware,
  loggerMiddleware,
  perfMiddleware,
  RelayNetworkLayer,
} from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { showLoggerMiddleware, showPerfMiddleware } from "app/utils/loggers"

const createNetworkLayer = () => {
  /**
   * FIXME: As the following rely on the global store, we can't be sure that
   * it's available at import time and so the below have been moved to lazy
   * imports.
   */
  const { errorMiddleware } = require("../middlewares/errorMiddleware")
  const { authMiddleware } = require("../middlewares/authMiddleware")
  const { metaphysicsUrlMiddleware } = require("../middlewares/metaphysicsUrlMiddleware")
  const { checkAuthenticationMiddleware } = require("../middlewares/checkAuthenticationMiddleware")

  const network = new RelayNetworkLayer(
    [
      // Default to size 100 and ttl 900000 (15 minutes)
      cacheMiddleware({
        size: 100, // max 100 requests
        ttl: 900000, // 15 minutes
      }),
      metaphysicsUrlMiddleware(),
      // @ts-ignore
      errorMiddleware(),
      __DEV__ && !__TEST__ ? (showLoggerMiddleware ? loggerMiddleware() : null) : null,
      // __DEV__ ? relayErrorMiddleware() : null,
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

export const createEnvironment = () => {
  const environment = new Environment({
    network: createNetworkLayer(),
    store: new Store(new RecordSource()),
  })

  return environment
}
