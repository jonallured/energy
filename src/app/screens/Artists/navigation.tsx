import { Suspense } from "react"
import { StackNav } from "app/Navigation"
import { ArtistTabs, SkeletonArtistTabs } from "app/screens/Artists/ArtistTabs/ArtistTabs"

export type ArtistNavigationScreens = {
  ArtistTabs: { slug: string; name: string }
}

export const ArtistNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen
        name="ArtistTabs"
        children={() => (
          <Suspense fallback={<SkeletonArtistTabs />}>
            <ArtistTabs />
          </Suspense>
        )}
      />
    </StackNav.Group>
  )
}
