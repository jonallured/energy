import { StackNav } from "app/Navigation"
import { Artwork } from "app/screens/Artwork/Artwork"
import { ArtworkWebView } from "app/screens/Artwork/ArtworkWebView"

export type ArtworkNavigationScreens = {
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  ArtworkWebView: { uri: string }
}

export const ArtworkNavigation = () => {
  return (
    <>
      <StackNav.Screen name="ArtworkWebView" component={ArtworkWebView} />
      <StackNav.Screen name="Artwork" component={Artwork} />
    </>
  )
}
