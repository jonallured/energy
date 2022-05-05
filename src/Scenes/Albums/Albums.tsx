// import { Flex, Text } from "palette"
import { View, Text } from "react-native"
import React from "react"
import { Tabs } from "react-native-collapsible-tab-view"

export const AlbumsScreen = () => {
  return <Tabs.FlatList data={[1, 2, 3, 4, 5]} renderItem={({ item }) => <Text>Album {item}</Text>} />
  return (
    <Flex>
      <Text>Albums Screen</Text>
    </Flex>
  )
}
