import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Flex, BackButtonWithBackground } from "palette"
import { NAVBAR_HEIGHT } from "../notExposed/ActualHeader"
import { useSetHandledTopSafeArea } from "../atoms"

export const FloatingHeaderBackButton = ({ onBack }: { onBack: () => void }) => {
  useSetHandledTopSafeArea(false)
  const insets = useSafeAreaInsets()

  return (
    <Flex
      position="absolute"
      top={insets.top}
      left={0}
      right={0}
      height={NAVBAR_HEIGHT}
      px={10}
      flexDirection="row"
      alignItems="center"
    >
      <BackButtonWithBackground onPress={onBack} />
    </Flex>
  )
}
