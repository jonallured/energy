import { range } from "lodash"
import { useState } from "react"
import { Switch } from "react-native"
import { Flex, MenuIcon, Screen, Text } from "palette"

export const StorybookScreenHeader = () => {
  const [longTitle, setLongTitle] = useState(false)
  const title = longTitle
    ? "cool title, but veeeeery long, like crazy looooong title wow!"
    : "cool title, short"

  return (
    <Screen>
      <Screen.Header title={title} leftElements={<MenuIcon />} />

      <Screen.Body scroll nosafe>
        <Flex flexDirection="row">
          <Text>Use long title:</Text>
          <Switch value={longTitle} onValueChange={setLongTitle} />
        </Flex>
        {range(100).map((x) => (
          <Text>wow content {x}</Text>
        ))}
      </Screen.Body>
    </Screen>
  )
}
