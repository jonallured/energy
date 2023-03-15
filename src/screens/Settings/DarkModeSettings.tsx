import { Screen } from "components/Screen"
import { SettingsItem } from "components/SettingsItem"
import { useEffect } from "react"
import { Platform } from "react-native"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { GlobalStore } from "system/store/GlobalStore"

export const DarkModeSettings = () => {
  const isUsingSystemColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forcedColorScheme = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  useEffect(() => {
    const update = async () => {
      if (Platform.OS === "android") {
        if (forcedColorScheme === "dark") {
          await changeNavigationBarColor("black", false, false)
        } else {
          await changeNavigationBarColor("white", true, false)
        }
      }
    }
    update()
  }, [isUsingSystemColorScheme, forcedColorScheme])

  return (
    <Screen>
      <Screen.Header title="Dark Mode" />
      <Screen.Body scroll>
        <SettingsItem title="Dark mode always on">
          <SettingsItem.Toggle
            value={forcedColorScheme === "dark"}
            onValueChange={(value) => {
              GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(false)
              GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "dark" : "light")
            }}
          />
        </SettingsItem>
        <SettingsItem
          title="Follow System Settings"
          subtitle="Automatically turn Dark Mode on or off based on the system's Dark Mode settings"
        >
          <SettingsItem.Toggle
            value={isUsingSystemColorScheme}
            onValueChange={(value) => {
              GlobalStore.actions.devicePrefs.setForcedColorScheme("light")
              GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
            }}
          />
        </SettingsItem>
      </Screen.Body>
    </Screen>
  )
}
