import { Flex, Text } from "@artsy/palette-mobile"

export const ListEmptyComponent = ({ text = "No results to display" }: { text?: string }) => (
  <Flex ml={2}>
    <Text variant="xs" color="onBackgroundMedium">
      {text}
    </Text>
  </Flex>
)
