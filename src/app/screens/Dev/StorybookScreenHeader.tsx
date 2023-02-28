import { Flex, MenuIcon, Text } from "@artsy/palette-mobile"
import { range } from "lodash"
import { Screen } from "palette"
import { useState } from "react"
import { Switch } from "react-native"

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
