import { StackNav } from "Navigation"
import {
  ArtistTabs,
  SkeletonArtistTabs,
} from "apps/Artists/routes/ArtistTabs/ArtistTabs"
import { Suspense } from "react"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

export type ArtistRoutes = {
  ArtistTabs: { slug: string; name: string }
}

export const ArtistsRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen
        name="ArtistTabs"
        children={() => (
          <RetryErrorBoundary>
            <Suspense fallback={<SkeletonArtistTabs />}>
              <ArtistTabs />
            </Suspense>
          </RetryErrorBoundary>
        )}
      />
    </StackNav.Group>
  )
}
