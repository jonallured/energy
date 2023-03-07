import { ArtsyMarkBlackIcon, Flex } from "@artsy/palette-mobile"

interface ImagePlaceholderProps {
  height?: number
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ height = 100 }) => {
  return (
    <Flex alignItems="center" justifyContent="center" height={height} backgroundColor="black10">
      <ArtsyMarkBlackIcon width={80} height={80} />
    </Flex>
  )
}
