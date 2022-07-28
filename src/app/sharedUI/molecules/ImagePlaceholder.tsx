import { ArtsyMarkIcon, Flex } from "palette"

export const ImagePlaceholder = ({ height = 100 }: { height: number }) => {
  return (
    <Flex alignItems="center" justifyContent="center" height={height} backgroundColor="black10">
      <ArtsyMarkIcon width={80} height={80} />
    </Flex>
  )
}
