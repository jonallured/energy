import { useEffect } from "react"
import { setupSentry } from "system/devTools/sentrySetup"
import { GlobalStore } from "system/store/GlobalStore"

export function useErrorReporting() {
  const environment = GlobalStore.useAppState((store) => store.config.environment.activeEnvironment)

  useEffect(() => {
    setupSentry({ environment })
  }, [environment])
}
