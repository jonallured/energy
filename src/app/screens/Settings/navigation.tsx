import { StackNav } from "app/Navigation"
import { DarkModeSettings } from "app/screens/Settings/DarkModeSettings"
import { EmailSettings } from "app/screens/Settings/Email/EmailSettings"
import { MultipleArtworksAndArtists } from "app/screens/Settings/Email/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "app/screens/Settings/Email/MultipleArtworksBySameArtist"
import { OneArtwork } from "app/screens/Settings/Email/OneArtwork"
import { OfflineModeSettings } from "app/screens/Settings/OfflineModeSettings"
import { PresentationModeSettings } from "app/screens/Settings/PresentationModeSettings"
import { Settings } from "app/screens/Settings/Settings"

export type SettingsNavigationScreens = {
  DarkModeSettings: undefined
  PresentationModeSettings: undefined
  Settings: undefined
  OfflineModeSettings: undefined
  EmailSettings: undefined
  MultipleArtworksAndArtists: undefined
  MultipleArtworksBySameArtist: undefined
  OneArtwork: undefined
}

export const SettingsNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Settings" component={Settings} />
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen name="PresentationModeSettings" component={PresentationModeSettings} />
      <StackNav.Screen name="OfflineModeSettings" component={OfflineModeSettings} />

      <StackNav.Screen name="EmailSettings" component={EmailSettings} />
      <StackNav.Screen name="MultipleArtworksAndArtists" component={MultipleArtworksAndArtists} />
      <StackNav.Screen
        name="MultipleArtworksBySameArtist"
        component={MultipleArtworksBySameArtist}
      />
      <StackNav.Screen name="OneArtwork" component={OneArtwork} />
    </StackNav.Group>
  )
}
