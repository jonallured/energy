import { StackNav } from "app/Navigation"
import { EmailScreen } from "app/screens/Artists/ArtistTabs/ArtistArtworks/EmailScreen/EmailScreen"
import { MultipleArtworksAndArtists } from "app/screens/Artists/ArtistTabs/ArtistArtworks/EmailScreen/MultipleArtworksAndArtists"
import { MultipleArtworksBySameArtist } from "app/screens/Artists/ArtistTabs/ArtistArtworks/EmailScreen/MultipleArtworksBySameArtist"
import { OneArtwork } from "app/screens/Artists/ArtistTabs/ArtistArtworks/EmailScreen/OneArtwork"

export type EmailNavigationScreens = {
  EmailScreen: undefined
  MultipleArtworksAndArtists: undefined
  MultipleArtworksBySameArtist: undefined
  OneArtwork: undefined
}

export const EmailNavigation = () => {
  return (
    <StackNav.Group>
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
