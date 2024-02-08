import { StackNav } from "Navigation"
import { Artwork } from "apps/Artwork/routes/Artwork/Artwork"
import { ArtworkWebView } from "apps/Artwork/routes/ArtworkWebView"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

export type ArtworkRoutes = {
  Artwork: { slug: string; contextArtworkSlugs?: string[] }
  ArtworkWebView: { uri: string; internalID: string; slug: string }
}

export const ArtworkRouter = () => {
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
