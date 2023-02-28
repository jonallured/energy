import { setupSentry } from "app/system/devTools/setupSentry"
import { GlobalStore } from "app/system/store/GlobalStore"
import { useEffect } from "react"

export function useErrorReporting() {
  const environment = GlobalStore.useAppState((store) => store.config.environment.activeEnvironment)

  useEffect(() => {
    setupSentry({ environment })
  }, [environment])
}
