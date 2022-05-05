import { SelectPartnerScreen } from "@Scenes/SelectPartner/SelectPartner"
import React from "react"
import { GlobalStore } from "@store/GlobalStore"
import { Tabs } from "react-native-collapsible-tab-view"
import { Flex, Text } from "palette"
import { Artists } from "@Scenes/Artists/Artists"
import { Shows } from "@Scenes/Shows/Shows"
import { Albums } from "@Scenes/Albums/Albums"

const HEADER_HEIGHT = 250

const Header = () => {
  return (
    <Flex px={2} pt={4}>
      <Text variant="lg">Folio</Text>
    </Flex>
  )
}

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <Tabs.Container renderHeader={Header} headerHeight={HEADER_HEIGHT}>
      <Tabs.Tab name="Artists">
        <Artists />
      </Tabs.Tab>
      <Tabs.Tab name="Shows">
        <Shows />
      </Tabs.Tab>
      <Tabs.Tab name="Ablums">
        <Albums />
      </Tabs.Tab>
    </Tabs.Container>
  )
}
