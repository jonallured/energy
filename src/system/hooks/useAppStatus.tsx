import { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"

export interface AppStatusProps {
  onChange?: (status: AppStateStatus) => void
  onForeground?: () => void
  onBackground?: () => void
}

export const useAppStatus = ({
  onForeground,
  onBackground,
}: AppStatusProps) => {
  /**
   * App Status
   * @active     The app is running in the foreground
   * @background The app is running in the background. The user is either in
   *             another app or on the home screen
   * @inactive   [iOS] This is a transition state that currently never happens
   *             for typical React Native apps.
   */
  const appStatus = useRef(AppState.currentState)

  useEffect(() => {
    const handleAppStateChange = (nextAppStatus: AppStateStatus) => {
      // Foreground
      if (
        appStatus.current.match(/inactive|background/) &&
        nextAppStatus === "active"
      ) {
        onForeground?.()
      }

      // Background
      if (appStatus.current.match(/active/) && nextAppStatus === "background") {
        onBackground?.()
      }

      appStatus.current = nextAppStatus
    }

    const appStatusListeners = AppState.addEventListener(
      "change",
      handleAppStateChange
    )

    return () => {
      appStatusListeners.remove()
    }
  }, [appStatus.current, onForeground, onBackground])

  return {
    appStatus: appStatus.current,
  }
}
