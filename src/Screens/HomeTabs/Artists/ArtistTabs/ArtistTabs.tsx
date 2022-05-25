import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TabsContainer } from "helpers/components/TabsContainer"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import React from "react"
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { Shows } from "./Shows/Shows"
import { Works } from "./Works/Works"

type ArtistTabsProps = NativeStackScreenProps<HomeTabsScreens, "ArtistTabs">

type HeaderProps = {
  artistName: string
  navigation: ArtistTabsProps["navigation"]
}

const Header = ({ artistName, navigation }: TabBarProps & HeaderProps) => {
  return (
    <Flex px={2} mt={2}>
      <Touchable
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ArrowLeftIcon fill="black100" />
      </Touchable>
      <Text variant="lg" mt={2}>
        {artistName}
      </Text>
    </Flex>
  )
}

export const ArtistTabs = ({ route, navigation }: ArtistTabsProps) => {
  const { artistName } = route.params

  return (
    <TabsContainer
      header={(props) => <Header artistName={artistName} navigation={navigation} {...props} />}
    >
      <Tabs.Tab name="Works" label="Works">
        <Works />
      </Tabs.Tab>
      <Tabs.Tab name="Shows" label="Shows">
        <Shows />
      </Tabs.Tab>
    </TabsContainer>
  )
}
