import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SettingsScreen } from "./Settings/Settings"
import { SettingsPresenterModeScreen } from "./SettingsPresenterMode/SettingsPresenterMode"
import { SettingsPrivacyDataRequestScreen } from "./SettingsPrivacyDataRequest/SettingsPrivacyDataRequest"

export type SettingsScreenStack = {
  Settings: undefined
  SettingsPrivacyDataRequest: undefined
  SettingsPresenterMode: undefined
}

export const SettingsScreenStackNavigator = createStackNavigator<SettingsScreenStack>()

export const SettingsScreenStack = () => {
  return (
    <SettingsScreenStackNavigator.Navigator>
      <SettingsScreenStackNavigator.Screen name="Settings" component={SettingsScreen} />
      <SettingsScreenStackNavigator.Screen
        name="SettingsPrivacyDataRequest"
        options={{ title: "Privacy Data Request" }}
        component={SettingsPrivacyDataRequestScreen}
      />
      <SettingsScreenStackNavigator.Screen
        name="SettingsPresenterMode"
        options={{ title: "Presenter Mode" }}
        component={SettingsPresenterModeScreen}
      />
    </SettingsScreenStackNavigator.Navigator>
  )
}
