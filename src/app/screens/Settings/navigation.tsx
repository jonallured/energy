import { StackCardStyleInterpolator } from "@react-navigation/stack"
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
    <StackNav.Group>
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen name="EditPresentationMode" component={EditPresentationMode} />
      <StackNav.Screen name="Settings" component={Settings} options={{ ...slideFromLeft }} />
    </StackNav.Group>
  )
}

const slideFromLeft: { cardStyleInterpolator: StackCardStyleInterpolator } = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
}
