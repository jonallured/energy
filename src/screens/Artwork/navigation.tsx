import { StackNav } from "Navigation"
import { Artwork } from "screens/Artwork/Artwork"
import { ArtworkWebView } from "screens/Artwork/ArtworkWebView"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

export type ArtworkNavigationScreens = {
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  ArtworkWebView: { uri: string; internalID: string; slug: string }
}

export const ArtworkNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="ArtworkWebView" component={ArtworkWebView} />
      <StackNav.Screen
        name="Artwork"
        children={() => (
          <RetryErrorBoundary>
            <Artwork />
          </RetryErrorBoundary>
        )}
      />
    </StackNav.Group>
  )
}
