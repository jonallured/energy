import { SelectPartnerScreen } from "@Scenes/SelectPartner/SelectPartner"
import React from "react"
import { GlobalStore } from "@store/GlobalStore"
import { Tabs } from "react-native-collapsible-tab-view"
import { StyleSheet, View, ListRenderItem } from "react-native"
import { Flex, Text } from "palette"
import { ArtistsScreen } from "@Scenes/Artists/Artists"

const HEADER_HEIGHT = 250

const DATA = [0, 1, 2, 3, 4]
const identity = (v: unknown): string => v + ""

const Header = () => {
  return (
    <Flex px={2} pt={4}>
      <Text variant="lg">Folio</Text>
    </Flex>
  )
}

const MainAuthenticatedStack: React.FC = () => {
  const renderItem: ListRenderItem<number> = React.useCallback(({ index }) => {
    return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
  }, [])

  return (
    <Tabs.Container
      renderHeader={Header}
      headerHeight={HEADER_HEIGHT} // optional
    >
      <Tabs.Tab name="Artists">
        <Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />
        {/* <ArtistsScreen /> */}
      </Tabs.Tab>
      <Tabs.Tab name="Shows">
        <Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />
      </Tabs.Tab>
      <Tabs.Tab name="Albums">
        <Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />
      </Tabs.Tab>
    </Tabs.Container>
  )
}

const styles = StyleSheet.create({
  box: {
    height: 250,
    width: "100%",
  },
  boxA: {
    backgroundColor: "white",
  },
  boxB: {
    backgroundColor: "#D8D8D8",
  },
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    backgroundColor: "#2196f3",
  },
})

export const AuthenticatedStack = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return <MainAuthenticatedStack />
}
