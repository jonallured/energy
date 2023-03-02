import { GlobalStore } from "app/system/store/GlobalStore"
import { useStoreRehydrated } from "easy-peasy"
import { useEffect, useState } from "react"

export const useSystemIsDoneBooting = () => {
  const isStoreRehydrated = useStoreRehydrated() // from easy-peasy persistence
  const isDonePerformingMigrations = GlobalStore.useAppState(
    (state) => state.system.sessionState.isDonePerformingMigrations
  )
  const [isDoneBooting, setIsDoneBooting] = useState(false)

  useEffect(() => {
    if (isStoreRehydrated && isDonePerformingMigrations) {
      console.log("[system]: Booted.")

      setIsDoneBooting(true)
    }
  }, [isStoreRehydrated, isDonePerformingMigrations, setIsDoneBooting])

  return isDoneBooting
}
