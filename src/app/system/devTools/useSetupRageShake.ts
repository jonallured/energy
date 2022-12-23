import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { NativeModules } from "react-native"
import RNShake from "react-native-shake"
import { NavigationScreens } from "app/Navigation"
import { GlobalStore } from "app/system/store/GlobalStore"

export const useSetupRageShake = () => {
  const nav = useNavigation<NavigationProp<NavigationScreens>>()
  const isUserDev = GlobalStore.useAppState((state) => state.artsyPrefs.isUserDev)

  useEffect(() => {
    if (__DEV__ || isUserDev) {
      NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(false)
    }
  }, [isUserDev])

  useEffect(() => {
    if (__DEV__ || isUserDev) {
      const subscription = RNShake.addListener(() => {
        nav.navigate("DevMenu")
      })

      return () => subscription.remove()
    }
  }, [isUserDev, nav])

  return null
}
