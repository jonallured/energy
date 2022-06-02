import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import React from "react"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { TabsContainer } from "Screens/_helpers/TabsContainer"
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { Shows } from "./Shows/Shows"
import { Artworks } from "./Artworks/Artworks"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"

type ArtistTabsProps = NativeStackScreenProps<HomeTabsScreens, "ArtistTabs">

type HeaderProps = {
  artistName: string
  navigation: ArtistTabsProps["navigation"]
}

const Header: React.FC<TabBarProps & HeaderProps> = ({ artistName, navigation }) => {
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

export const ArtistTabs: React.FC<ArtistTabsProps> = ({ route, navigation }) => {
  const { slug } = route.params

  return (
    <Suspense
      fallback={
        <Flex justifyContent={"center"} flex={1}>
          <ActivityIndicator />
        </Flex>
      }
    >
      <RenderArtistTabs slug={slug} navigation={navigation} />
    </Suspense>
  )
}

type RenderArtistTabsProps = {
  slug: string
  navigation: ArtistTabsProps["navigation"]
}

const RenderArtistTabs: React.FC<RenderArtistTabsProps> = ({ slug, navigation }) => {
  const data = useLazyLoadQuery<ArtistTabsQuery>(
    graphql`
      query ArtistTabsQuery($slug: String!) {
        artist(id: $slug) {
          name
        }
      }
    `,
    { slug }
  )

  return (
    <TabsContainer
      header={(props) => (
        <Header artistName={data.artist?.name!} navigation={navigation} {...props} />
      )}
    >
      <Tabs.Tab name="Artworks" label="Works">
        <Artworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="Shows" label="Shows">
        <Shows />
      </Tabs.Tab>
    </TabsContainer>
  )
}
