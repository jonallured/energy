import { StackNav } from "Navigation"
import { DarkModeSettings } from "screens/Settings/DarkModeSettings"
import { EmailSettings } from "screens/Settings/Email/EmailSettings"
import { MultipleArtworksAndArtists } from "screens/Settings/Email/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "screens/Settings/Email/MultipleArtworksBySameArtist"
import { OneArtwork } from "screens/Settings/Email/OneArtwork"
import { OfflineModeSettings } from "screens/Settings/OfflineMode/OfflineModeSettings"
// import { OfflineModeSync } from "screens/Settings/OfflineMode/OfflineModeSync"
import { PresentationModeSettings } from "screens/Settings/PresentationModeSettings"
import { Settings } from "screens/Settings/Settings"

export type SettingsNavigationScreens = {
  DarkModeSettings: undefined
  PresentationModeSettings: undefined
  Settings: undefined
  OfflineModeSettings: undefined
  OfflineModeSync: undefined
  EmailSettings: undefined
  EmailSettingsMultipleArtworksAndArtists: undefined
  EmailSettingsMultipleArtworksBySameArtist: undefined
  EmailSettingsOneArtwork: undefined
}

export const SettingsNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Settings" component={Settings} />
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen name="PresentationModeSettings" component={PresentationModeSettings} />
      <StackNav.Screen name="OfflineModeSettings" component={OfflineModeSettings} />

      <StackNav.Screen name="EmailSettings" component={EmailSettings} />
      <StackNav.Screen
        name="EmailSettingsMultipleArtworksAndArtists"
        component={MultipleArtworksAndArtists}
      />
      <StackNav.Screen
        name="EmailSettingsMultipleArtworksBySameArtist"
        component={MultipleArtworksBySameArtist}
      />
      <StackNav.Screen name="EmailSettingsOneArtwork" component={OneArtwork} />
    </StackNav.Group>
  )
}
