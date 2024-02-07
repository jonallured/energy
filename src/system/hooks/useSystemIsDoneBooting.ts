import { useFlagsStatus } from "@unleash/proxy-client-react"
import { useStoreRehydrated } from "easy-peasy"
import { useEffect, useState } from "react"

export const useSystemIsDoneBooting = () => {
  const isStoreRehydrated = useStoreRehydrated() // from easy-peasy persistence
  const { flagsReady, flagsError } = useFlagsStatus()
  const [isDoneBooting, setIsDoneBooting] = useState(false)

  useEffect(() => {
    if (isStoreRehydrated && flagsReady) {
      console.log("[system]: Booted.")

      setIsDoneBooting(true)
    }

    if (flagsError) {
      console.error("[system]: Error loading featureFlags:", flagsError)
    }
  }, [isStoreRehydrated, flagsReady, flagsError, setIsDoneBooting])

  return isDoneBooting
}
