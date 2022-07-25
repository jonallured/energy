import {
  cacheMiddleware,
  // errorMiddleware as relayErrorMiddleware,
  loggerMiddleware,
  perfMiddleware,
  RelayNetworkLayer,
} from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"
import { showLoggerMiddleware, showPerfMiddleware } from "../../../utils/loggers"
import { authMiddleware } from "../middlewares/authMiddleware"
import { errorMiddleware } from "../middlewares/errorMiddleware"
import { metaphysicsUrlMiddleware } from "../middlewares/metaphysicsUrlMiddleware"

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
  ],
  {
    // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
    // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
    noThrow: true,
  }
) // as second arg you may pass advanced options for RRNL

export const createEnvironment = () =>
  new Environment({
    network: network,
    store: new Store(new RecordSource()),
  })
