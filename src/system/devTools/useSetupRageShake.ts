import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { useEffect } from "react"
import { NativeModules } from "react-native"
import RNShake from "react-native-shake"
import { GlobalStore } from "system/store/GlobalStore"

export const useSetupRageShake = () => {
  const nav = useNavigation<NavigationProp<NavigationScreens>>()
  const isUserDev = GlobalStore.useAppState(
    (state) => state.artsyPrefs.isUserDev
  )

  useEffect(() => {
    if (__DEV__) {
      NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(!isUserDev)
    }
  }, [isUserDev])

  useEffect(() => {
    if (isUserDev) {
      const subscription = RNShake.addListener(() => {
        GlobalStore.actions.devicePrefs.setShowDevMenuButton(true)
      })

      return () => subscription.remove()
    }
  }, [isUserDev, nav])

  return null
}
