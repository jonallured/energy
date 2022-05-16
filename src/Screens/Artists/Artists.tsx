import React from "react"
import { Text } from "palette"
import { Tabs } from "react-native-collapsible-tab-view"

export const Artists = () => {
  return <Tabs.FlatList data={[1, 2, 3, 4, 5]} renderItem={({ item }) => <Text>Artist {item}</Text>} />
}
