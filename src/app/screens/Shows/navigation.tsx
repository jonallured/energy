import { Suspense } from "react"
import { StackNav } from "app/Navigation"
import { ShowTabs, SkeletonShowTabs } from "app/screens/Shows/ShowTabs/ShowTabs"
import { RetryErrorBoundary } from "app/system/wrappers/RetryErrorBoundary"

export type ShowsNavigationScreens = {
  ShowTabs: { slug: string }
}

export const ShowsNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen
        name="ShowTabs"
        children={() => (
          <RetryErrorBoundary>
            <Suspense fallback={<SkeletonShowTabs />}>
              <ShowTabs />
            </Suspense>
          </RetryErrorBoundary>
        )}
      />
    </StackNav.Group>
  )
}
