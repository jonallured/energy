import { Flex, FlexProps } from "palette"
import { useScreenIsFullWidthBody } from "../atoms"
import { SCREEN_HORIZONTAL_PADDING } from "./Body"

export const FullWidthItem = (props: FlexProps) => {
  const fullWidthBody = useScreenIsFullWidthBody()

  return <Flex {...props} mx={fullWidthBody ? undefined : -SCREEN_HORIZONTAL_PADDING} />
}
