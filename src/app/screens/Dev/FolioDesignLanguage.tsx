import { Button, Color, Flex, Text, useColor } from "@artsy/palette-mobile"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"

export const FolioDesignLanguage = () => {
  const colorScheme = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme)
  const setColorScheme = GlobalStore.actions.devicePrefs.setForcedColorScheme

  return (
    <Screen>
      <Screen.Header title="Folio Design Language" />
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
        <Flex flexDirection="row" flex={1}>
          <Flex flex={1}>
            <Title title="Colors" subtitle="bg, surfaces" />
            <ColorBlock value="background" />
            <ColorBlock value="primary" />
            <ColorBlock value="secondary" />
            <ColorBlock value="brand" />
          </Flex>
          <Flex flex={1}>
            <Title title="On Colors" subtitle="text, icons" />
            <ColorBlock value="onBackgroundHigh" />
            <ColorBlock value="onPrimaryHigh" />
            <ColorBlock value="onSecondaryHigh" />
            <ColorBlock value="onBrand" />
          </Flex>
        </Flex>
        <Flex flex={1}>
          <Title title="onBackground" />
          <ColorBlock value="background" />
          <Flex flexDirection="row">
            <ColorBlock value="onBackgroundHigh" />
            <ColorBlock value="onBackgroundMedium" />
            <ColorBlock value="onBackgroundLow" />
          </Flex>
          <Text variant="lg">onPrimary</Text>
          <ColorBlock value="primary" />
          <Flex flexDirection="row">
            <ColorBlock value="onPrimaryHigh" />
            <ColorBlock value="onPrimaryMedium" />
            <ColorBlock value="onPrimaryLow" />
          </Flex>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const Title = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <Flex mt={4}>
      <Text variant="lg">{title} </Text>
      <Text>{subtitle}</Text>
    </Flex>
  )
}

const ColorBlock = ({ value }: { value: Color }) => {
  const color = useColor()

  return (
    <Flex mb={0.5} flex={1} mt={1}>
      <Flex backgroundColor={value} borderWidth={1} borderColor="onBackgroundLow" p={0.5}>
        <Text color={on[value]}>{value}</Text>
        <Text variant="sm" color={on[value]}>
          {color(value)}
        </Text>
      </Flex>
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
