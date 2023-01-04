import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { range } from "lodash"
import { Screen } from "palette"

export const StorybookSkeletons = () => {
  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="Loading Skeletons" />

      <Screen.Body scroll>
        <Skeleton>
          <Join separator={<Spacer y={1} />}>
            <SkeletonText variant="lg">Hi i am loading</SkeletonText>
            <SkeletonText variant="md">Me too</SkeletonText>
            <SkeletonText variant="sm">Also loading</SkeletonText>
            <SkeletonText variant="xs">Also loading</SkeletonText>
          </Join>

          <Spacer y={2} />

          <Flex flexDirection="row" flexWrap="wrap">
            {range(100).map((index) => (
              <SkeletonBox key={index} mr={1} mb={1} width={20} height={20} />
            ))}
          </Flex>
        </Skeleton>
      </Screen.Body>
    </Screen>
  )
}
