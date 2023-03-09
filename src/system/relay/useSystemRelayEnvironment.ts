import { useContext } from "react"
import { RelayContext } from "system/relay/RelayProvider"

export const useSystemRelayEnvironment = () => {
  const relayContext = useContext(RelayContext)
  return relayContext
}
