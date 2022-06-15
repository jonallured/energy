import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import { TabsContainer } from "app/wrappers/TabsContainer"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistShows } from "./ArtistShows/ArtistShows"
import { SuspenseWrapper } from "app/wrappers/SuspenseWrapper"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"

type HeaderProps = {
  artistName: string
}

const Header = ({ artistName }: HeaderProps) => {
  const navigation = useNavigation()
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

type ArtistTabsRoute = RouteProp<HomeTabsScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug } = useRoute<ArtistTabsRoute>().params

  return (
    <SuspenseWrapper>
      <RenderArtist slug={slug} />
    </SuspenseWrapper>
  )
}

type RenderArtistProps = {
  slug: string
}

const RenderArtist: React.FC<RenderArtistProps> = ({ slug }) => {
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
    <TabsContainer header={(props) => <Header artistName={data.artist?.name!} {...props} />}>
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <ArtistArtworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <ArtistShows slug={slug} />
      </Tabs.Tab>
    </TabsContainer>
  )
}
