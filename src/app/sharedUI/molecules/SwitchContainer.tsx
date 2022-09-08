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
    <Flex flexDirection="row" mx={2} alignItems="center" justifyContent="space-between">
      <Text>{label}</Text>
      <Switch
        trackColor={{ false: "white", true: "blue" }}
        ios_backgroundColor={color("black30")}
        onValueChange={onValueChange}
        value={value}
      />
    </Flex>
  )
}
