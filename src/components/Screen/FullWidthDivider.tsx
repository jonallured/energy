import { FlexProps, Separator, Screen } from "@artsy/palette-mobile"

export const FullWidthDivider: React.FC<FlexProps> = (flexProps) => {
  return (
    <Screen.FullWidthItem>
      <Separator my={2} {...flexProps} />
    </Screen.FullWidthItem>
  )
}
