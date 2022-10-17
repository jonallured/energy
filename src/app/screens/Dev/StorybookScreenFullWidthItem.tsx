import { range } from "lodash"
import { Screen, Text } from "palette"
import { FullWidthItem } from "palette/organisms/Screen/exposed/FullWidthItem"

export const StorybookScreenFullWidthItem = () => (
  <Screen>
    <Screen.Header title="cool title" />

    <Screen.Body scroll>
      {range(100).map((x) =>
        x > 10 && x < 20 ? (
          <FullWidthItem>
            <Text>SUPER cool content {x} that takes full width!</Text>
          </FullWidthItem>
        ) : (
          <Text>wow content {x}</Text>
        )
      )}
    </Screen.Body>
  </Screen>
)
