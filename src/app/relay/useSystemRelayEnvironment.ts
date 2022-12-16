import { useContext } from "react"
import { RelayContext } from "app/relay/RelayProvider"

export const useSystemRelayEnvironment = () => {
  const relayContext = useContext(RelayContext)
  return relayContext
}
