import { Suspense } from "react"
import { StackNav } from "app/Navigation"
import { ShowTabs, SkeletonShowTabs } from "app/screens/Shows/ShowTabs/ShowTabs"

export type ShowsNavigationScreens = {
  ShowTabs: { slug: string }
}

export const ShowsNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen
        name="ShowTabs"
        children={() => (
          <Suspense fallback={<SkeletonShowTabs />}>
            <ShowTabs />
          </Suspense>
        )}
      />
    </StackNav.Group>
  )
}
