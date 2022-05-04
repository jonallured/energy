import { SelectPartnerScreen } from "@Scenes/SelectPartner/SelectPartner"
import React from "react"
import { GlobalStore } from "@store/GlobalStore"
import { Tabs } from "react-native-collapsible-tab-view"
import { StyleSheet, View, ListRenderItem } from "react-native"
import { Flex, Text } from "palette"

const HEADER_HEIGHT = 250

const DATA = [0, 1]
const identity = (v: unknown): string => v + ""

const Header = () => {
  return (
    <Flex px={2} pt={4}>
      <Text variant="lg">Folio</Text>
    </Flex>
  )
}
const ArtistsScreen = () => (
  <Flex backgroundColor={"orange"} flex={1}>
    <Text variant="xl">Aaaartistsssss</Text>
    <Text>Aaaartists</Text>
    <Text>Aaaartists</Text>
    <Text>Aaaartists</Text>
    <Text>Aaaartists</Text>
  </Flex>
)
const ShowsScreen = () => (
  <Flex backgroundColor={"purple"} flex={1}>
    <Text variant="xl">ShowsScreen</Text>
    <Text>Shows</Text>
    <Text>Shows</Text>
    <Text>Shows</Text>
    <Text>Shows</Text>
  </Flex>
)

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  const renderItem: ListRenderItem<number> = React.useCallback(({ index }) => {
    return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
  }, [])

  const renderArtists: ListRenderItem<number> = React.useCallback(({ index }) => {
    return <ArtistsScreen />
  }, [])
  const renderShows: ListRenderItem<number> = React.useCallback(({ index }) => {
    return <ShowsScreen />
  }, [])

  // return <ArtistsScreen />

  return (
    <Tabs.Container
      renderHeader={Header}
      headerHeight={HEADER_HEIGHT} // optional
    >
      <Tabs.Tab name="Artists">
        <Tabs.FlatList
          data={DATA}
          renderItem={renderArtists}
          // keyExtractor={identity}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Shows">
        <Tabs.FlatList data={DATA} renderItem={renderShows} keyExtractor={identity} />
      </Tabs.Tab>
      {/* <Tabs.Tab name="Shows">
        <Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />
      </Tabs.Tab>
      <Tabs.Tab name="Albums">
        <Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />
      </Tabs.Tab> */}
    </Tabs.Container>
  )
}

const styles = StyleSheet.create({
  box: {
    // height: 250,
    // width: "100%",
  },
  boxA: {
    // backgroundColor: "white",
  },
  boxB: {
    // backgroundColor: "#D8D8D8",
  },
  header: {
    // height: HEADER_HEIGHT,
    // width: "100%",
    // backgroundColor: "#2196f3",
  },
})
