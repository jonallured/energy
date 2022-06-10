import { Flex } from "palette"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { TabsScrollView } from "./TabsTestWrappers"

type ArtsySuspenseProps = {
  withTabs?: boolean
}

export const SuspenseWrapper: React.FC<ArtsySuspenseProps> = (props) => {
  return (
    <Suspense
      fallback={
        props.withTabs ? (
          <TabsScrollView>
            <ActivityIndicator />
          </TabsScrollView>
        ) : (
          <Flex flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator />
          </Flex>
        )
      }
    >
      {props.children}
    </Suspense>
  )
}
