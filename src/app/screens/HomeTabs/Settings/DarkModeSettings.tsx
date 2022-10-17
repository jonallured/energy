import { SettingsItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

export const DarkModeSettings = () => {
  const syncWithSystem = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forceMode = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="Dark Mode" />
      <Screen.Body scroll>
        <SettingsItem title="Dark mode always on">
          <SettingsItem.Toggle
            value={forceMode === "dark"}
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
            value={syncWithSystem}
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
