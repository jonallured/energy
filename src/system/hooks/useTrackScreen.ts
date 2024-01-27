import { ScreenNames } from "Navigation"
import { useEffect } from "react"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useIsScreenVisibible } from "utils/hooks/useIsScreenVisible"

export const useTrackScreen = (screenName: ScreenNames) => {
  const { trackScreenView } = useAppTracking()

  const isScreenVisible = useIsScreenVisibible(screenName)

  useEffect(() => {
    if (isScreenVisible) {
      trackScreenView(screenName)
    }
  }, [isScreenVisible])
}
