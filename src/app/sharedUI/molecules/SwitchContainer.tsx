import { Switch } from "react-native"
import { Flex, Text, useColor } from "palette"

interface SwitchContainerProps {
  label: string
  onValueChange: () => void
  value: boolean | undefined
}

export const SwitchContainer = ({ label, onValueChange, value }: SwitchContainerProps) => {
  const color = useColor()
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
      <Text>{label}</Text>
      <Switch
        trackColor={{ false: "white", true: "blue" }}
        ios_backgroundColor={color("onBackgroundLow")}
        onValueChange={onValueChange}
        value={value}
      />
    </Flex>
  )
}
