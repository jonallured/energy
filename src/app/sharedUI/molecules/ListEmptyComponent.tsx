import { Text } from "@artsy/palette-mobile"

export const ListEmptyComponent = ({ text = "No results to display" }: { text?: string }) => (
  <Text variant="xs" color="onBackgroundMedium">
    {text}
  </Text>
)
