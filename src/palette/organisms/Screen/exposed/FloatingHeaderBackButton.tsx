import { BackButtonWithBackground, Flex } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSetHandledTopSafeArea } from "../atoms"
import { NAVBAR_HEIGHT } from "../notExposed/ActualHeader"

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
