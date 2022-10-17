import { range } from "lodash"
import { BellIcon, MagnifyingGlassIcon, Screen, Text } from "palette"

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
