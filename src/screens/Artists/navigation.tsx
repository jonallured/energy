import { StackNav } from "Navigation"
import { Suspense } from "react"
import { ArtistTabs, SkeletonArtistTabs } from "screens/Artists/ArtistTabs/ArtistTabs"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

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
