import { Flex } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const ScreenBase: React.FC = ({ children }) => {
  return (
    <Flex flex={1} backgroundColor="background">
      {children}

      <SafeAreaCover />
    </Flex>
  )
}

const SafeAreaCover = () => {
  const insets = useSafeAreaInsets()

  return (
    <Flex
      position="absolute"
      left={0}
      right={0}
      top={0}
      height={insets.top}
      backgroundColor="background"
    />
  )
}
