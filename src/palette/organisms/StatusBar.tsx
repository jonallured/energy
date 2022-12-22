import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Flex } from "@artsy/palette-mobile"

interface StatusBarProps {
  backgroundColor?: string
}

export const StatusBar = ({ backgroundColor }: StatusBarProps) => {
  const saInsets = useSafeAreaInsets()
  return (
    <Flex
      position="absolute"
      backgroundColor={backgroundColor}
      left={0}
      right={0}
      top={0}
      height={saInsets.top}
    />
  )
}
