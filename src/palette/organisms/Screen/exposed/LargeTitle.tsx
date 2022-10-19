import { Flex, Text } from "@artsy/palette-mobile"
import { useAnimatedHeaderTitle } from "../atoms"

export const LARGE_TITLE_HEIGHT = 64

export const LargeTitle = () => {
  const title = useAnimatedHeaderTitle()

  return (
    <Flex height={LARGE_TITLE_HEIGHT} pl="2" justifyContent="center">
      <Text variant="lg-display" numberOfLines={2}>
        {title ?? ""}
      </Text>
    </Flex>
  )
}
