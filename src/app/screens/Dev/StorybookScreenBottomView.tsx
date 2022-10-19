import { Button, Input, Text } from "@artsy/palette-mobile"
import { range } from "lodash"
import { Screen } from "palette"

export const StorybookScreenBottomView = () => (
  <Screen>
    <Screen.Header title="cool title" />

    <Screen.Body scroll>
      {range(100).map((x) =>
        x % 20 === 0 ? (
          <Input placeholder="insert some text in here" />
        ) : (
          <Text>wow content {x}</Text>
        )
      )}
      <Screen.BottomView>
        <Button>cool button</Button>
      </Screen.BottomView>
    </Screen.Body>
  </Screen>
)
