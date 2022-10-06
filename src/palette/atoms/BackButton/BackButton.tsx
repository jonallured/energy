import { TouchableOpacity } from "react-native"
import { ChevronIcon, CloseIcon, Flex } from "palette"

interface BackButtonProps {
  onPress?: () => void
  showX?: boolean
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, showX = false }) => (
  <TouchableOpacity onPress={onPress}>
    {showX ? (
      <CloseIcon fill="onBackground" width={26} height={26} />
    ) : (
      <ChevronIcon direction="left" fill="onBackgroundHigh" />
    )}
  </TouchableOpacity>
)

export const BackButtonWithBackground: React.FC<BackButtonProps> = ({ onPress, showX = false }) => (
  <TouchableOpacity onPress={onPress}>
    <Flex
      backgroundColor="white100"
      width={40}
      height={40}
      borderRadius={20}
      alignItems="center"
      justifyContent="center"
    >
      {showX ? (
        <CloseIcon fill="onBackground" width={26} height={26} />
      ) : (
        <ChevronIcon direction="left" />
      )}
    </Flex>
  </TouchableOpacity>
)
