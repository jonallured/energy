import { Flex, Tabs } from "@artsy/palette-mobile"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"

type ArtsySuspenseProps = {
  withTabs?: boolean
}

export const SuspenseWrapper: React.FC<ArtsySuspenseProps> = ({ withTabs, children }) => {
  return (
    <Suspense
      fallback={
        withTabs ? (
          <Tabs.ScrollView>
            <Flex my={2}>
              <ActivityIndicator />
            </Flex>
          </Tabs.ScrollView>
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
