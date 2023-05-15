import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ActivityIndicator } from "react-native"
import { GlobalStore } from "system/store/GlobalStore"

export const OfflineLoadingWrapper: React.FC = ({ children }) => {
  const { isLoadingFromOfflineCache } = GlobalStore.useAppState(
    (state) => state.networkStatus.sessionState
  )

  if (isLoadingFromOfflineCache) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Loading from Cache...</Text>
        <Spacer y={2} />
        <ActivityIndicator color="black" />
      </Flex>
    )
  }

  return <>{children}</>
}
