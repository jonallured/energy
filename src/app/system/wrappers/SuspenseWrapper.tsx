import { Flex } from "@artsy/palette-mobile"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { TabsScrollView } from "app/components/Tabs/TabsContent"

type ArtsySuspenseProps = {
  withTabs?: boolean
}

export const SuspenseWrapper: React.FC<ArtsySuspenseProps> = ({ withTabs, children }) => {
  return (
    <Suspense
      fallback={
        withTabs ? (
          <TabsScrollView>
            <Flex my={2}>
              <ActivityIndicator />
            </Flex>
          </TabsScrollView>
        ) : (
          <Flex backgroundColor="background" flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator />
          </Flex>
        )
      }
    >
      {children}
    </Suspense>
  )
}
