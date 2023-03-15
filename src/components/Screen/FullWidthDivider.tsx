import { FlexProps, Separator } from "@artsy/palette-mobile"
import { Screen } from "components/Screen"

export const FullWidthDivider: React.FC<FlexProps> = (flexProps) => {
  return (
    <Screen.FullWidthItem>
      <Separator my={2} {...flexProps} />
    </Screen.FullWidthItem>
  )
}
