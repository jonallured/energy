import { Spacer, Flex, Separator, Text, useColor } from "@artsy/palette-mobile"
import { Switch, SwitchProps } from "react-native"
import { Screen } from "palette"

interface SettingsItemProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

const SettingsItemRoot = ({ title, subtitle, children }: SettingsItemProps) => (
  <>
    <Spacer y="2" />
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Text>{title}</Text>
      {children}
    </Flex>
    {subtitle !== undefined && (
      <Text variant="xs" color="onBackgroundMedium">
        {subtitle}
      </Text>
    )}
    <Spacer y="2" />
    <Screen.FullWidthItem>
      <Separator />
    </Screen.FullWidthItem>
  </>
)

const Toggle = (props: SwitchProps) => {
  const color = useColor()
  return <Switch trackColor={{ true: color("brand") }} {...props} />
}

export const SettingsItem = Object.assign(SettingsItemRoot, {
  Toggle,
})
