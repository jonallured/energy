import { ArtsyMarkBlackIcon, Flex } from "@artsy/palette-mobile"

export const ImagePlaceholder = ({ height = 100 }: { height: number }) => {
  return (
    <Flex alignItems="center" justifyContent="center" height={height} backgroundColor="black10">
      <ArtsyMarkBlackIcon width={80} height={80} />
    </Flex>
  )
}
