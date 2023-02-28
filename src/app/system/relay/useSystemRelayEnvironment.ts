import { RelayContext } from "app/system/relay/RelayProvider"
import { useContext } from "react"

export const useSystemRelayEnvironment = () => {
  const relayContext = useContext(RelayContext)
  return relayContext
}
