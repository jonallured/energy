import { Flex, Text } from "palette"

export const ListEmptyComponent = ({ text }: { text: string }) => (
  <Flex ml={2}>
    <Text color="black60">{text}</Text>
  </Flex>
)
