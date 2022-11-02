import { Flex, Text } from "@artsy/palette-mobile"
import { range } from "lodash"
import { useState } from "react"
import { Switch } from "react-native"
import { Screen } from "palette"

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
          <Text key={`${x}`}>wow content {x}</Text>
        ))}
      </Screen.Body>
    </Screen>
  )
}
