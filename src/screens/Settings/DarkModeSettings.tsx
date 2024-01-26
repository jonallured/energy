import { Text, Screen } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { SettingsItem } from "components/SettingsItem"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

export const DarkModeSettings = () => {
  useTrackScreen("DarkModeSettings")

  const navigation = useNavigation()
  const isUsingSystemColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forcedColorScheme = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  return (
    <Screen>
      <Screen.Header onBack={navigation.goBack} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={1}>
          Dark Mode
        </Text>

        <SettingsItem title="Dark mode always on">
          <SettingsItem.Toggle
            accessibilityRole="switch"
            accessibilityLabel="Dark mode always on switch"
            accessibilityValue={{ text: forcedColorScheme === "dark" ? "on" : "off" }}
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
            accessibilityRole="switch"
            accessibilityLabel="Follow System Settings switch"
            accessibilityValue={{ text: isUsingSystemColorScheme ? "on" : "off" }}
            value={isUsingSystemColorScheme}
            onValueChange={(value) => {
              GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
              if (value) {
                GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "light" : "dark")
              }
            }}
          />
        </SettingsItem>
      </Screen.Body>
    </Screen>
  )
}
