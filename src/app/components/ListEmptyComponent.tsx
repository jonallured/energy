import { BoxProps, Flex, Text } from "@artsy/palette-mobile"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"

interface ListEmptyComponentProps extends BoxProps {
  text?: string
}

export const ListEmptyComponent: React.FC<ListEmptyComponentProps> = ({
  text = "No results to display",
  ...rest
}) => {
  return (
    <Flex ml={SCREEN_HORIZONTAL_PADDING} my={1} {...rest}>
      <Text variant="xs" color="onBackgroundMedium">
        {text}
      </Text>
    </Flex>
  )
}
