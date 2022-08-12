import { Screen, Spacer } from "palette"
import { GlobalStore } from "app/store/GlobalStore"
import { Header, SettingsItem } from "app/sharedUI"

export const DarkModeSettings = () => {
  const syncWithSystem = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forceMode = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  return (
    <Screen>
      <Screen.RawHeader>
        <Header label="Dark mode settings" />
      </Screen.RawHeader>
      <Screen.Body>
        <Spacer y={2} />

        <SettingsItem
          title="Sync with system"
          subtitle="Automatically turn dark mode on or off based on the system's dark mode setting."
        >
          <SettingsItem.Toggle
            value={syncWithSystem}
            onValueChange={(value) =>
              GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
            }
          />
        </SettingsItem>

        <Spacer y={2} />

        <SettingsItem
          title="Dark mode always on"
          subtitle="Dark mode when turned on, light mode when turned off."
        >
          <SettingsItem.Toggle
            value={forceMode === "dark"}
            disabled={syncWithSystem}
            onValueChange={(value) =>
              GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "dark" : "light")
            }
          />
        </SettingsItem>
      </Screen.Body>
    </Screen>
  )
}
