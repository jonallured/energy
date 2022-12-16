import { useMemo } from "react"
import { Environment, RelayEnvironmentProvider } from "react-relay"
import { createEnvironment } from "app/relay/environment/createEnvironment"

export const RelayProvider: React.FC = ({ children }) => {
  const environment = useMemo(() => createEnvironment(), [])

  return (
    <RelayEnvironmentProvider environment={environment as Environment}>
      {children}
    </RelayEnvironmentProvider>
  )
}
