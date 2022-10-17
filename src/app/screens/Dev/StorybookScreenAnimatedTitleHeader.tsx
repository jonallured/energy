import { range } from "lodash"
import { Flex, Screen, Text } from "palette"
import { useState } from "react"
import { Switch } from "react-native"

export const StorybookScreenAnimatedTitleHeader = () => {
  const [longTitle, setLongTitle] = useState(false)
  const title = longTitle
    ? "cool title, but veeeeery long, like crazy looooong title wow!"
    : "cool title, short"

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title={title} />

      <Screen.Body scroll>
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
