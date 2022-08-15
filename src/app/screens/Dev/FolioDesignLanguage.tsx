import { Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Button, Color, Flex, Screen, Spacer, Text, useColor } from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const FolioDesignLanguage = () => {
  const colorScheme = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme)
  const setColorScheme = GlobalStore.actions.devicePrefs.setForcedColorScheme

  return (
    <Screen>
      <Screen.RawHeader>
        <Header label="Folio Design Language" safeAreaInsets />
      </Screen.RawHeader>
      <Screen.Body scroll>
        <Text>
          Currently in <Text variant="lg">{colorScheme}</Text> mode
        </Text>
        <Flex flexDirection="row">
          <Button size="small" onPress={() => setColorScheme("light")}>
            light
          </Button>
          <Button size="small" onPress={() => setColorScheme("dark")}>
            dark
          </Button>
        </Flex>
        <Spacer y={1} />

        <Flex flex={1}>
          <Flex flexDirection="row" flex={1}>
            <Flex flex={1}>
              <Text variant="lg">Colors (bg, cards, buttons)</Text>
              <ColorBlock value="background" />
              <ColorBlock value="primary" />
              <ColorBlock value="secondary" />
              <ColorBlock value="brand" />
            </Flex>
            <Flex flex={1}>
              <Text variant="lg">On Colors (text, icons)</Text>
              <ColorBlock value="onBackgroundHigh" />
              <ColorBlock value="onPrimaryHigh" />
              <ColorBlock value="onSecondaryHigh" />
              <ColorBlock value="onBrand" />
            </Flex>
          </Flex>
          <Spacer y={1} />

          <Flex flex={1}>
            <Text variant="lg">onBackground</Text>
            <ColorBlock value="background" />
            <Flex flexDirection="row">
              <ColorBlock value="onBackgroundHigh" />
              <ColorBlock value="onBackgroundMedium" />
              <ColorBlock value="onBackgroundLow" />
            </Flex>
            <Spacer y={6} />

            <Text variant="lg">onPrimary</Text>
            <ColorBlock value="primary" />
            <Flex flexDirection="row">
              <ColorBlock value="onPrimaryHigh" />
              <ColorBlock value="onPrimaryMedium" />
              <ColorBlock value="onPrimaryLow" />
            </Flex>
          </Flex>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const ColorBlock = ({ value }: { value: Color }) => {
  const color = useColor()

  return (
    <Flex
      flex={1}
      height={80}
      maxHeight={80}
      backgroundColor={value}
      borderWidth={1}
      borderColor={on[value]}
    >
      <Text variant="lg" color={on[value]} ml={1} mt={1}>
        {value}
      </Text>
      <Text variant="sm" color={on[value]} style={{ position: "absolute", bottom: 10, right: 10 }}>
        {color(value)}
      </Text>
    </Flex>
  )
}

const on: Partial<Record<Color, Color>> = {
  background: "onBackgroundHigh",
  primary: "onPrimaryHigh",
  secondary: "onSecondaryHigh",
  brand: "onBrand",

  onBackgroundHigh: "background",
  onPrimaryHigh: "primary",
  onSecondaryHigh: "secondary",
  onBrand: "brand",
}
