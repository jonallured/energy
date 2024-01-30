import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ActivityIndicator } from "react-native"
import { GlobalStore } from "system/store/GlobalStore"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const OfflineLoadingWrapper: React.FC = ({ children }) => {
  const { isLoadingFromOfflineCache } = GlobalStore.useAppState(
    (state) => state.networkStatus.sessionState
  )

  const isDarkMode = useIsDarkMode()

  if (isLoadingFromOfflineCache) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Loading offline from cache... This may take a moment for large collections.</Text>
        <Spacer y={2} />
        <ActivityIndicator color={isDarkMode ? "white" : "black"} />
      </Flex>
    )
  }

  return <>{children}</>
}
