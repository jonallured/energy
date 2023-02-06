import { useStoreRehydrated } from "easy-peasy"
import { useEffect, useState } from "react"
import { GlobalStore } from "app/system/store/GlobalStore"

export const useSystemIsDoneBooting = () => {
  const isStoreRehydrated = useStoreRehydrated() // from easy-peasy persistence
  const isDonePerformingMigrations = GlobalStore.useAppState(
    (state) => state.sessionState.isDonePerformingMigrations
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
