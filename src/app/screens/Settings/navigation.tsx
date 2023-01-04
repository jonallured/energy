import { StackCardStyleInterpolator } from "@react-navigation/stack"
import { StackNav } from "app/Navigation"
import { DarkModeSettings } from "app/screens/Settings/DarkModeSettings"
import { EmailScreen } from "app/screens/Settings/EmailScreen"
import { MultipleArtworksAndArtists } from "app/screens/Settings/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "app/screens/Settings/MultipleArtworksBySameArtist"
import { OfflineModeSettings } from "app/screens/Settings/OfflineModeSettings"
import { OneArtwork } from "app/screens/Settings/OneArtwork"
import { PresentationModeSettings } from "app/screens/Settings/PresentationModeSettings"
import { Settings } from "app/screens/Settings/Settings"

export type SettingsNavigationScreens = {
  DarkModeSettings: undefined
  PresentationModeSettings: undefined
  Settings: undefined
  OfflineModeSettings: undefined
  EmailScreen: undefined
  MultipleArtworksAndArtists: undefined
  MultipleArtworksBySameArtist: undefined
  OneArtwork: undefined
}

export const SettingsNavigation = () => {
  return (
    <StackNav.Group screenOptions={{ ...slideFromLeft }}>
      <StackNav.Screen name="Settings" component={Settings} />
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen name="PresentationModeSettings" component={PresentationModeSettings} />
      <StackNav.Screen name="OfflineModeSettings" component={OfflineModeSettings} />

      <StackNav.Screen name="EmailScreen" component={EmailScreen} />
      <StackNav.Screen name="MultipleArtworksAndArtists" component={MultipleArtworksAndArtists} />
      <StackNav.Screen
        name="MultipleArtworksBySameArtist"
        component={MultipleArtworksBySameArtist}
      />
      <StackNav.Screen name="OneArtwork" component={OneArtwork} />
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
