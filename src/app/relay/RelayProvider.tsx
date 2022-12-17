import { createContext, useMemo, useState } from "react"
import { Environment, RelayEnvironmentProvider } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes"
import { createEnvironment } from "app/relay/environment/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"

export interface RelayContextProps {
  relayEnvironment: RelayModernEnvironment
  resetRelayEnvironment: (records?: RecordMap) => void
}

export const RelayContext = createContext<RelayContextProps>({
  relayEnvironment: null as unknown as RelayModernEnvironment,
  resetRelayEnvironment: () => null,
})

export const RelayProvider: React.FC = ({ children }) => {
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)
  const environment = useMemo(() => createEnvironment(), [])
  const [relayEnvironment, setRelayEnvironment] = useState<RelayModernEnvironment>(environment)

  const providerValues = {
    relayEnvironment: relayEnvironment,
    resetRelayEnvironment: (records?: RecordMap) => {
      setRelayEnvironment(createEnvironment(records))
    },
  }

  if (!isOnline) {
    relayEnvironment.getStore().holdGC()
  }

  return (
    <RelayContext.Provider value={providerValues}>
      <RelayEnvironmentProvider environment={relayEnvironment as Environment}>
        {children}
      </RelayEnvironmentProvider>
    </RelayContext.Provider>
  )
}
