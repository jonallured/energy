import { View, Text } from "react-native"
import React from "react"
import { Tabs } from "react-native-collapsible-tab-view"

export const Albums = () => {
  return (
    <Tabs.FlatList data={[1, 2, 3, 4, 5]} renderItem={({ item }) => <Text>Album {item}</Text>} />
  )
}
