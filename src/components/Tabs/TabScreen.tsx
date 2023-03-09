import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"
import { SuspenseWrapper } from "system/wrappers/SuspenseWrapper"

export const TabScreen: React.FC = ({ children }) => {
  return (
    <RetryErrorBoundary withoutBackButton>
      <SuspenseWrapper withTabs>{children}</SuspenseWrapper>
    </RetryErrorBoundary>
  )
}
