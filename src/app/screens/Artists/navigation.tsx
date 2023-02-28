import { StackNav } from "app/Navigation"
import { ArtistTabs, SkeletonArtistTabs } from "app/screens/Artists/ArtistTabs/ArtistTabs"
import { RetryErrorBoundary } from "app/system/wrappers/RetryErrorBoundary"
import { Suspense } from "react"

export type ArtistNavigationScreens = {
  ArtistTabs: { slug: string; name: string }
}

export const ArtistNavigation = () => {
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
