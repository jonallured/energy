import { Flex, Text } from "palette"
import { Switch } from "react-native"

interface SettingsItemProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

const SettingsItemRoot = ({ title, subtitle, children }: SettingsItemProps) => (
  <>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Text>{title}</Text>
      {children}
    </Flex>
    {subtitle !== undefined && <Text variant="xs">{subtitle}</Text>}
  </>
)

const Toggle = Switch

export const SettingsItem = Object.assign(SettingsItemRoot, {
  Toggle,
})
