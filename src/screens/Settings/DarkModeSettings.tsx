import { Text } from "@artsy/palette-mobile"
import { Screen } from "components/Screen"
import { SettingsItem } from "components/SettingsItem"
import { useState } from "react"
import { GlobalStore } from "system/store/GlobalStore"

export const DarkModeSettings = () => {
  const [overrideDarkMode, setOverrideDarkMode] = useState(false)
  const isUsingSystemColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forcedColorScheme = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  return (
    <Screen>
      <Screen.Header />
      <Screen.Body scroll>
        <Text variant="lg-display" my={2}>
          Dark Mode
        </Text>

        <SettingsItem title="Dark mode always on">
          <SettingsItem.Toggle
            value={forcedColorScheme === "dark" && overrideDarkMode}
            onValueChange={(value) => {
              setOverrideDarkMode(value)
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
              setOverrideDarkMode(false)
              GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
              GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "dark" : "light")
            }}
          />
        </SettingsItem>
      </Screen.Body>
    </Screen>
  )
}
