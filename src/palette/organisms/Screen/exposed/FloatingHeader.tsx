import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Flex, BackButtonWithBackground } from "palette"
import { useSetHandledTopSafeArea } from "../atoms"
import { NAVBAR_HEIGHT } from "../notExposed/ActualHeader"

/**
 * @deprecated Use `Screen.Header` instead.
 */
export const FloatingHeader = ({ onBack }: { onBack: () => void }) => {
  useSetHandledTopSafeArea(false)
  const insets = useSafeAreaInsets()

  if (onBack) {
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
  return null
}
FloatingHeader.defaultProps = { __TYPE: "screen:floating-header" }
