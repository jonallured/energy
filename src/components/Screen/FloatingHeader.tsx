import { BackButtonWithBackground, Flex, Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { NAVBAR_HEIGHT, ZINDEX } from "components/Screen/constants"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface FloatingHeaderProps {
  onBack?: () => void
  rightElements?: React.ReactNode
}

export const FloatingHeader = ({ onBack, rightElements }: FloatingHeaderProps) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <Flex
      position="absolute"
      pointerEvents="box-none"
      top={insets.top}
      left={0}
      right={0}
      zIndex={ZINDEX.floatingHeader}
      height={NAVBAR_HEIGHT}
      px={1}
      flexDirection="row"
      alignItems="center"
    >
      <BackButtonWithBackground onPress={onBack ?? navigation.goBack} />

      <Flex flex={1} />

      {rightElements && (
        <Flex flexDirection="row" alignItems="center">
          <Spacer x={1} />
          {rightElements}
        </Flex>
      )}
    </Flex>
  )
}
