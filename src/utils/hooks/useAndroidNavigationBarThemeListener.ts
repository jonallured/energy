import { useEffect } from "react"
import { Platform } from "react-native"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { GlobalStore } from "system/store/GlobalStore"

export const useAndroidNavigationBarThemeListener = () => {
  const isUsingSystemColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forcedColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.forcedColorScheme
  )
  const systemColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.systemColorScheme
  )

  useEffect(() => {
    const update = async () => {
      if (Platform.OS === "android") {
        if (isUsingSystemColorScheme) {
          const navigationBarColor =
            systemColorScheme === "light" ? "white" : "black"
          const isLight = systemColorScheme === "light"

          await changeNavigationBarColor(navigationBarColor, isLight, false)
        } else if (forcedColorScheme === "dark") {
          await changeNavigationBarColor("black", false, false)
        } else {
          await changeNavigationBarColor("white", true, false)
        }
      }
    }
    update()
  }, [isUsingSystemColorScheme, forcedColorScheme, systemColorScheme])
}
