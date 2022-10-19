import { BellIcon, MagnifyingGlassIcon, Text } from "@artsy/palette-mobile"
import { range } from "lodash"
import { Screen } from "palette"

export const StorybookScreenHeaderElements = () => (
  <Screen>
    <Screen.Header
      title="cool title"
      rightElements={
        <>
          <MagnifyingGlassIcon />
          <BellIcon />
        </>
      }
    />

    <Screen.Body scroll nosafe>
      {range(100).map((x) => (
        <Text>wow content {x}</Text>
      ))}
    </Screen.Body>
  </Screen>
)
