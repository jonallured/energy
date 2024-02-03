import { Flex, Tabs } from "@artsy/palette-mobile"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

type ArtsySuspenseProps = {
  withTabs?: boolean
}

export const SuspenseWrapper: React.FC<ArtsySuspenseProps> = ({
  withTabs,
  children,
}) => {
  const isDarkMode = useIsDarkMode()

  return (
    <Suspense
      fallback={
        withTabs ? (
          <Tabs.ScrollView>
            <Flex my={2}>
              <ActivityIndicator color={isDarkMode ? "white" : "black"} />
            </Flex>
          </Tabs.ScrollView>
        ) : (
          <Flex
            backgroundColor="background"
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <ActivityIndicator color={isDarkMode ? "white" : "black"} />
          </Flex>
        )
      }
    >
      {children}
    </Suspense>
  )
}
