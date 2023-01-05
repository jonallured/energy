import { createContext, useMemo, useState } from "react"
import { Environment, RelayEnvironmentProvider } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes"
import { createEnvironment } from "app/system/relay/environment/createEnvironment"
import { GlobalStore } from "app/system/store/GlobalStore"

export interface RelayContextProps {
  relayEnvironment: RelayModernEnvironment
  resetRelayEnvironment: (records?: RecordMap) => void
}

export const RelayContext = createContext<RelayContextProps>({
  relayEnvironment: null as unknown as RelayModernEnvironment,
  resetRelayEnvironment: () => null,
})

export const RelayProvider: React.FC<Partial<Pick<RelayContextProps, "relayEnvironment">>> = ({
  children,
  relayEnvironment,
}) => {
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)
  const environment = useMemo(() => relayEnvironment ?? createEnvironment(), [])
  const [currentRelayEnvironment, setRelayEnvironment] =
    useState<RelayModernEnvironment>(environment)

  const providerValues = {
    relayEnvironment: currentRelayEnvironment,
    resetRelayEnvironment: (records?: RecordMap) => {
      setRelayEnvironment(createEnvironment(records))
    },
  }

  if (!isOnline) {
    currentRelayEnvironment.getStore().holdGC()
  }

  return (
    <RelayContext.Provider value={providerValues}>
      <RelayEnvironmentProvider environment={currentRelayEnvironment as Environment}>
        {children}
      </RelayEnvironmentProvider>
    </RelayContext.Provider>
  )
}
