import { StackCardStyleInterpolator } from "@react-navigation/stack"
import { StackNav } from "app/Navigation"
import { DarkModeSettings } from "app/screens/Settings/DarkModeSettings"
import { OfflineModeSettings } from "app/screens/Settings/OfflineModeSettings"
import { PresentationModeSettings } from "app/screens/Settings/PresentationModeSettings"
import { Settings } from "app/screens/Settings/Settings"

export type SettingsNavigationScreens = {
  DarkModeSettings: undefined
  PresentationModeSettings: undefined
  Settings: undefined
  OfflineModeSettings: undefined
}

export const SettingsNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Settings" component={Settings} options={{ ...slideFromLeft }} />
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen name="PresentationModeSettings" component={PresentationModeSettings} />
      <StackNav.Screen name="OfflineModeSettings" component={OfflineModeSettings} />
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
