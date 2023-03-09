import { Flex, FlexProps, SpacingUnitDSValue } from "@artsy/palette-mobile"
import { useScreenIsFullWidthBody } from "components/Screen/atoms"
import { SCREEN_HORIZONTAL_PADDING } from "./Body"

export const FullWidthItem = (props: FlexProps) => {
  const fullWidthBody = useScreenIsFullWidthBody()

  return (
    <Flex
      {...props}
      mx={fullWidthBody ? undefined : (-SCREEN_HORIZONTAL_PADDING as SpacingUnitDSValue)}
    />
  )
}
