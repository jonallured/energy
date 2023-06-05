import { Flex } from "@artsy/palette-mobile"
import { OfflineLoadingWrapper } from "system/sync/components/OfflineLoadingWrapper"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"
import { SuspenseWrapper } from "system/wrappers/SuspenseWrapper"

export const TabScreen: React.FC = ({ children }) => {
  return (
    <Flex flex={1} mt={2}>
      <RetryErrorBoundary withoutBackButton>
        <SuspenseWrapper withTabs>
          <OfflineLoadingWrapper>{children}</OfflineLoadingWrapper>
        </SuspenseWrapper>
      </RetryErrorBoundary>
    </Flex>
  )
}
