import { range } from "lodash"
import { Box, Screen, Text } from "palette"

export const StorybookScreenRawHeader = () => (
  <Screen>
    <Screen.RawHeader>
      <Text>damn can i put a red box up here?</Text>
      <Box width={40} height={30} backgroundColor="red" />
      <Text>wow, yea i can!</Text>
      <Text>can i put another one? maybe blue?</Text>
      <Box width={40} height={30} backgroundColor="blue" />
      <Text>woooooow, now thats a header!</Text>
    </Screen.RawHeader>

    <Screen.Body scroll>
      {range(100).map((x) => (
        <Text>wow content {x}</Text>
      ))}
    </Screen.Body>
  </Screen>
)
