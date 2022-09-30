import { Flex, Text } from "palette"

export const ListEmptyComponent = ({ text = "No results to display" }: { text?: string }) => (
  <Flex ml={2}>
    <Text variant="xs" color="onBackgroundMedium">
      {text}
    </Text>
  </Flex>
)
