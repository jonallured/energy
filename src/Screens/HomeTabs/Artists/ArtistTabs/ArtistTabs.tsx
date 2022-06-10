import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import { TabsContainer } from "Screens/_helpers/TabsContainer"
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistShows } from "./ArtistShows/ArtistShows"
import { SuspenseWrapper } from "Screens/_helpers/SuspenseWrapper"

type ArtistProps = NativeStackScreenProps<HomeTabsScreens, "ArtistTabs">

type HeaderProps = {
  artistName: string
  navigation: ArtistProps["navigation"]
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

export const ArtistTabs: React.FC<ArtistProps> = ({ route, navigation }) => {
  const { slug } = route.params

  return (
    <SuspenseWrapper>
      <RenderArtist slug={slug} navigation={navigation} />
    </SuspenseWrapper>
  )
}

type RenderArtistProps = {
  slug: string
  navigation: ArtistProps["navigation"]
}

const RenderArtist: React.FC<RenderArtistProps> = ({ slug, navigation }) => {
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
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <ArtistArtworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <ArtistShows />
      </Tabs.Tab>
    </TabsContainer>
  )
}
