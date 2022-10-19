import { Flex, FlexProps } from "palette"
import { SCREEN_HORIZONTAL_PADDING } from "./Body"
import { useScreenIsFullWidthBody } from "../atoms"

export const FullWidthItem = (props: FlexProps) => {
  const fullWidthBody = useScreenIsFullWidthBody()

  return <Flex {...props} mx={fullWidthBody ? undefined : -SCREEN_HORIZONTAL_PADDING} />
}
