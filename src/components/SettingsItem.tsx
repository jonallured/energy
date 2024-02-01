import {
  Screen,
  Spacer,
  Flex,
  Separator,
  Text,
  useColor,
} from "@artsy/palette-mobile"
import { Switch, SwitchProps } from "react-native"

interface SettingsItemProps {
  title: string
  subtitle?: string
  showBottomSeparator?: boolean
}

const SettingsItemRoot: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  children,
  showBottomSeparator = true,
}) => (
  <>
    <Spacer y={2} />
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text>{title}</Text>
      {children}
    </Flex>

    {subtitle !== undefined && (
      <Text variant="xs" color="onBackgroundMedium">
        {subtitle}
      </Text>
    )}

    <Spacer y={2} />

    {!!showBottomSeparator && (
      <Screen.FullWidthItem>
        <Separator />
      </Screen.FullWidthItem>
    )}
  </>
)

const Toggle = (props: SwitchProps) => {
  const color = useColor()
  return <Switch trackColor={{ true: color("brand") }} {...props} />
}

export const SettingsItem = Object.assign(SettingsItemRoot, {
  Toggle,
})
