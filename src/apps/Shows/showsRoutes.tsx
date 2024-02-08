import { StackNav } from "Navigation"
import { ShowTabs, SkeletonShowTabs } from "apps/Shows/routes/ShowTabs/ShowTabs"
import { Suspense } from "react"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

export type ShowsRoutes = {
  ShowTabs: { slug: string }
}

export const ShowsRouter = () => {
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
