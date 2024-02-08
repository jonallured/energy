import { StackNav } from "Navigation"
import { DarkModeSettings } from "apps/Settings/routes/DarkModeSettings"
import { EmailSettings } from "apps/Settings/routes/Email/EmailSettings"
import { MultipleArtworksAndArtists } from "apps/Settings/routes/Email/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "apps/Settings/routes/Email/MultipleArtworksBySameArtist"
import { OneArtwork } from "apps/Settings/routes/Email/OneArtwork"
import { OfflineModeSettings } from "apps/Settings/routes/OfflineMode/OfflineModeSettings"
import { PresentationModeSettings } from "apps/Settings/routes/PresentationModeSettings"
import { Settings } from "apps/Settings/routes/Settings"

export type SettingsRoutes = {
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

export const SettingsRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Settings" component={Settings} />
      <StackNav.Screen name="DarkModeSettings" component={DarkModeSettings} />
      <StackNav.Screen
        name="PresentationModeSettings"
        component={PresentationModeSettings}
      />
      <StackNav.Screen
        name="OfflineModeSettings"
        component={OfflineModeSettings}
      />

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
