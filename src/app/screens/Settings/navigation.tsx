import { StackNav } from "app/Navigation"
import { DarkModeSettings } from "app/screens/Settings/DarkModeSettings"
import { EditPresentationMode } from "app/screens/Settings/EditPresentationMode"
import { Settings } from "app/screens/Settings/Settings"

export type SettingsNavigationScreens = {
  DarkModeSettings: undefined
  EditPresentationMode: undefined
  Settings: undefined
}

export const SettingsNavigation = () => {
  return (
    <>
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen name="EditPresentationMode" component={EditPresentationMode} />
      <StackNav.Screen name="Settings" component={Settings} />
    </>
  )
}
