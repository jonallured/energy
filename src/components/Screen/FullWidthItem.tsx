import { Flex, FlexProps, SpacingUnitDSValue } from "@artsy/palette-mobile"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/constants"

export const FullWidthItem: React.FC<FlexProps> = (props) => {
  return <Flex {...props} mx={-SCREEN_HORIZONTAL_PADDING as SpacingUnitDSValue} />
}
