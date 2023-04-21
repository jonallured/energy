import { useStoreRehydrated } from "easy-peasy"
import { useEffect, useState } from "react"

export const useSystemIsDoneBooting = () => {
  const isStoreRehydrated = useStoreRehydrated() // from easy-peasy persistence
  const [isDoneBooting, setIsDoneBooting] = useState(false)

  useEffect(() => {
    if (isStoreRehydrated) {
      console.log("[system]: Booted.")

      setIsDoneBooting(true)
    }
  }, [isStoreRehydrated, setIsDoneBooting])

  return isDoneBooting
}
