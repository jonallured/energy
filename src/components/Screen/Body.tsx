import { Flex, FlexProps } from "@artsy/palette-mobile"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/constants"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface BodyProps extends FlexProps {
  fullwidth?: boolean
  safeArea?: boolean
  scroll?: boolean
}

export const Body: React.FC<BodyProps> = ({
  children,
  fullwidth,
  safeArea = true,
  ...flexProps
}) => {
  const insets = useSafeAreaInsets()

  return (
    <Flex
      flex={1}
      mt={`${insets.top}px`}
      mb={safeArea ? `${insets.bottom}px` : undefined}
      {...flexProps}
    >
      <Flex flex={1} px={fullwidth ? undefined : SCREEN_HORIZONTAL_PADDING}>
        {children}
      </Flex>
    </Flex>
  )
}
