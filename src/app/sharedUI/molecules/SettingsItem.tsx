import { Switch } from "react-native"
import { Flex, Separator, Text } from "palette"
import { Spacer } from "@artsy/palette-mobile"

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
    <Separator />
  </>
)

const Toggle = Switch

export const SettingsItem = Object.assign(SettingsItemRoot, {
  Toggle,
})
