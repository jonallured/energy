import { BoxProps, Flex, Text } from "@artsy/palette-mobile"

interface ListEmptyComponentProps extends BoxProps {
  text?: string
}

export const ListEmptyComponent: React.FC<ListEmptyComponentProps> = ({
  text = "No results to display",
  ...rest
}) => {
  return (
    <Flex {...rest}>
      <Text variant="xs" color="onBackgroundMedium">
        {text}
      </Text>
    </Flex>
  )
}
