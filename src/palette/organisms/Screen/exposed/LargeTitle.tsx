import { Flex, Text } from "@artsy/palette-mobile"
import { Skeleton, SkeletonText } from "app/components/Skeleton"
import { useAtom } from "jotai"
import { useAnimatedHeaderTitle } from "../atoms"

export const LARGE_TITLE_HEIGHT = 64

export const LargeTitle = () => {
  const title = useAnimatedHeaderTitle()

  if (!title) {
    return <PlaceholderLargeTitle />
  }

  return (
    <Flex height={LARGE_TITLE_HEIGHT} pl="2" justifyContent="center" alignSelf="flex-start">
      <Text variant="lg-display" numberOfLines={2}>
        {title ?? ""}
      </Text>
    </Flex>
  )
}

export const PlaceholderLargeTitle = () => {
  return (
    <Flex height={LARGE_TITLE_HEIGHT} pl="2" justifyContent="center" alignSelf="flex-start">
      <Skeleton>
        <SkeletonText variant="lg-display" numberOfLines={2}>
          Loading Name
        </SkeletonText>
      </Skeleton>
    </Flex>
  )
}
