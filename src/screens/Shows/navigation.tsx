import { StackNav } from "Navigation"
import { Suspense } from "react"
import { ShowTabs, SkeletonShowTabs } from "screens/Shows/ShowTabs/ShowTabs"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

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
