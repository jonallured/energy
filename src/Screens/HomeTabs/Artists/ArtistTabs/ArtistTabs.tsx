import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import React from "react"
import { MaterialTabBar, TabBarProps, Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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

export const ArtistTabs = () => {
  const insets = useSafeAreaInsets()

  const route = useRoute<ArtistTabsProps["route"]>()
  const navigation = useNavigation<ArtistTabsProps["navigation"]>()

  const { artistName } = route.params

  return (
    <Flex flex={1} pt={insets.top}>
      <Tabs.Container
        renderHeader={(props) => (
          <Header artistName={artistName} navigation={navigation} {...props} />
        )}
        headerContainerStyle={{
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        }}
        containerStyle={{ paddingTop: 20 }}
        TabBarComponent={(props) => (
          <MaterialTabBar
            scrollEnabled
            {...props}
            style={{ marginHorizontal: 10 }}
            labelStyle={{ margin: -10 }} // only way to match the design without patching the library
            tabStyle={{ margin: 10 }}
            indicatorStyle={{ backgroundColor: "black", width: "20%", height: 1 }}
          />
        )}
      >
        <Tabs.Tab name="Works" label="Works">
          <Works />
        </Tabs.Tab>
        <Tabs.Tab name="Shows" label="Shows">
          <Shows />
        </Tabs.Tab>
      </Tabs.Container>
    </Flex>
  )
}
