import { Flex, Text } from "palette"
import { BackButton } from "app/sharedUI/molecules/BackButton"
import { useNavigation } from "@react-navigation/native"
import { Switch } from "react-native"
// import { GlobalStore } from "app/store/GlobalStore"

export const DarkModeSettings = () => {
  const navigation = useNavigation()
  // const syncWithSystem = GlobalStore.useAppState((state) => state.devicePrefs.usingSystemColorScheme )
  const syncWithSystem = true
  const forceMode = "dark"
  return (
    <Flex m={2} mt={6}>
      <BackButton />
      <Text variant="lg">Dark Mode Settings</Text>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text my={2}>Sync with system</Text>
        <Switch
          value={syncWithSystem}
          onValueChange={
            (value) => {}
            // GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
          }
        />
      </Flex>
      <Text variant="xs" mb={2}>
        Automatically turn dark mode on or off based on the system's dark mode setting.
      </Text>

      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text>Dark Mode always on</Text>
        <Switch
          value={forceMode === "dark"}
          disabled={syncWithSystem}
          onValueChange={
            (value) => {}
            // GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "dark" : "light")
          }
        />
      </Flex>
      <Text variant="xs">Always use Dark Mode.</Text>
    </Flex>
  )
}
